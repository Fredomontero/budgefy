import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, ToastController } from 'ionic-angular';


//This is what we need from firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//This are the pages required
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-addtransaction',
  templateUrl: 'addtransaction.html',
})
export class AddtransactionPage {

  //Variables to get the value of the inputs
  @ViewChild('concept') concept;
  @ViewChild('amount') amount;
  errorMessage: string;
  payment_mehtod: string = "Select payment method";
  payment_id;
  transaction_type;
  items;
  payment_list;
  category_list;
  user_id; 

  //Litheral object constructor
  transaction = {type: 0, concept : '', amount : 0, paymentId : 0, datetime: '', id: 0};
  transaction_types: string[] = ["INCOME", "CASH WITHDRAWAL", "EXPENSE"];
  status_messages: string[] = ["Successfully registered transaction","The concept field is required", "The amount field is required", "There was a problem with the server"];

  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, private auth: AngularFireAuth, public alertCtrl: AlertController, private db: AngularFireDatabase,  private toast: ToastController) {
    this.user_id = this.auth.auth.currentUser.uid;
    this.loadPaymentMethods();
    this.loadCategories();
    this.loadUser();
  }

  //function to load the cards
  loadPaymentMethods(){
    this.db.list('/users/'+this.user_id+'/payment/').valueChanges().subscribe((d) => {
      this.payment_list = d;
    });
  }

  loadCategories(){
    this.db.list('/categories/').valueChanges().subscribe((d) => {
      this.category_list = d;
    });
  }

  ionViewDidLoad() {
    
  }

  //Function to load the user information
  loadUser(){
      var r = this.db.object('/users/'+this.user_id+'/').valueChanges().subscribe((d) => {
        this.items = d;
      });
  }

  //To remove the swipe menu in this page
  ionViewDidEnter(){
    this.menu.swipeEnable(false);
  }

  //This is to let other pages to have access to the menu  
  ionViewWillLeave(){
    this.menu.swipeEnable(true);
  }

  //function to add transaction
  addTransaction(){
    //This is needed in all transactions
    this.setTransaction(this.transaction);  //Set the transaction
    var paymnet_balance = this.payment_list[this.transaction.paymentId - 1].balance;  //The payment id is the index + 1 of the payment method in the payment_list
    var cash_balance = this.payment_list[0].balance;  //The payment id is the index + 1 of the payment method in the payment_list
    var transaction_amount = this.transaction.amount; 
    this.db.object('/users/'+this.user_id+'/transactions/'+this.transaction.id+'/').set(this.transaction);  //Store the transaction in the database
    this.db.list('/users/').update('/'+this.user_id+'/',{num_transactions:this.transaction.id + 1});  //Update the num_transactions of the user
    //If the transaction type is income
    if(this.transaction_type == 0){
      this.db.list('/users/').update('/'+this.user_id+'/payment/'+this.transaction.paymentId+'/',{balance: parseInt(paymnet_balance) + (transaction_amount | 0)});  //Update the balance of the used payment method
    }else if(this.transaction_type == 1){
      this.db.list('/users/').update('/'+this.user_id+'/payment/'+this.transaction.paymentId+'/',{balance: (paymnet_balance - transaction_amount)});  //Reduce the balance of the used payment method
      this.db.list('/users/').update('/'+this.user_id+'/payment/1/',{balance: parseInt(cash_balance) + (transaction_amount | 0)});  //Increase the cash
    }else{
      this.db.list('/users/').update('/'+this.user_id+'/payment/'+this.transaction.paymentId+'/',{balance: (paymnet_balance - transaction_amount)});  //Reduce the balance of the used payment method
    }
  }

  //Setting the texfield values to the properties of our object
  setTransaction(transaction){
    transaction.type = this.transaction_type;
    transaction.id = this.items.num_transactions;
    transaction.amount = this.amount.value;
    transaction.paymentId = this.payment_list[this.payment_id - 1].id;
    transaction.datetime = new Date().toLocaleString();
    if(this.transaction_type == 2){
      transaction.concept = this.concept.value;
    }
    
  }

  //Function to get the type of user (the value will change everytime a different value is selected)
  getPaymentId(id){
    this.payment_id = id;
    this.payment_mehtod = this.payment_list[id];
  }
  //Function to get the transaction type (the value will change everytime a different value is selected)
  getTransactionType(transaction_type){
    this.transaction_type = transaction_type;
    console.log("The transaction type is: ",this.transaction_type);
  }

  //Verifying that the form is filled properly
  validateForm(transaction){
    var error = 0;
    if(transaction.concept.length == 0){
      error = 1; 
    }else if(transaction.amount.length == 0){
      error = 2;
    }
    return error;
  }

  //Function to show the toast message
  displayStatus(index) {
    let toast = this.toast.create({
      message: this.status_messages[index],
      duration: 1500,
      position: 'bottom',
      cssClass: "toast_style"
    });
  
    toast.present();
  }

}

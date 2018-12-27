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
  category: string = "";
  payment_id;
  category_id;
  transaction_type = 'income';
  items;
  payment_list;
  category_list;
  user_id; 

  //Litheral object constructor
  transaction = {type: 0, concept : '', amount : 0, category: '', paymentId : 0, datetime: '', id: 0};
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
    var payment_balance = this.payment_list[this.transaction.paymentId - 1].balance;  //The payment id is the index + 1 of the payment method in the payment_list
    var cash_balance = this.payment_list[0].balance;  //The payment id is the index + 1 of the payment method in the payment_list
    var transaction_amount = this.transaction.amount;
    console.log('the transaction is: ', this.transaction);
    // this.db.object('/users/'+this.user_id+'/transactions/'+this.transaction.id+'/').set(this.transaction);  //Store the transaction in the database
    // this.db.list('/users/').update('/'+this.user_id+'/',{num_transactions:this.transaction.id + 1});  //Update the num_transactions of the user
    // if(this.transaction_type == 'income'){
    //   this.setIncome(payment_balance, transaction_amount);
    // }else if(this.transaction_type == 'expenses'){
    //   this.setExpense(payment_balance, transaction_amount, cash_balance);
    // }else{
    //   this.setTransfer(payment_balance, transaction_amount);      
    // }
  }

  setIncome(payment_balance, transaction_amount){
    this.db.list('/users/').update('/'+this.user_id+'/payment/'+this.transaction.paymentId+'/',{balance: parseInt(payment_balance) + (transaction_amount | 0)});  //Update the balance of the used payment method
  }

  setExpense(payment_balance, transaction_amount, cash_balance){
    this.db.list('/users/').update('/'+this.user_id+'/payment/'+this.transaction.paymentId+'/',{balance: (payment_balance - transaction_amount)});  //Reduce the balance of the used payment method
    this.db.list('/users/').update('/'+this.user_id+'/payment/1/',{balance: parseInt(cash_balance) + (transaction_amount | 0)});  //Increase the cash
  }

  setTransfer(payment_balance, transaction_amount){
    this.db.list('/users/').update('/'+this.user_id+'/payment/'+this.transaction.paymentId+'/',{balance: (payment_balance - transaction_amount)});  //Reduce the balance of the used payment method
  }

  //Setting the texfield values to the properties of our object
  setTransaction(transaction){
    if(this.transaction_type == 'income'){
      transaction.amount = this.amount.value;
      transaction.datetime = new Date().toLocaleString();
      transaction.id = this.items.num_transactions;
      transaction.type = this.transaction_type;
    }else if(this.transaction_type == 'expenses'){
      transaction.amount = this.amount.value;
      transaction.datetime = new Date().toLocaleString();
      transaction.id = this.items.num_transactions;
      transaction.type = this.transaction_type;
      transaction.paymentId = this.payment_list[this.payment_id - 1].id;
      transaction.category = this.category_list[this.category_id - 1].id;
    }
    
    
    
    
    
    if(this.transaction_type == 2){
      transaction.concept = this.concept.value;
    }
    
  }

  //Function to get the type of user (the value will change everytime a different value is selected)
  getPaymentId(id){
    this.payment_id = id;
    this.payment_mehtod = this.payment_list[id];
  }

  getCategoryId(id){
    this.category_id = id;
    this.category = this.category_list[id];
    console.log('The selected category is: ', this.category);
    
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

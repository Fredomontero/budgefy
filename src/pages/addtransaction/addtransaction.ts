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
  source_mehtod: string = "Select payment method";
  destination_mehtod: string = "Select payment method";
  transfer_src_lbl: string = 'SOURCE';
  transfer_dtn_lbl: string = 'DESTINATION';
  category: string = "";
  source_id;
  destination_id;
  category_id;
  transaction_type = 'income';
  items;
  payment_list;
  category_list;
  user_id; 

  //Litheral object constructor
  transaction = {type: '', concept : '', amount : 0, category: '', sourceId: 0, destinationId: 0, datetime: '', id: 0};
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
      console.log('The category list is: ', this.category_list);
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
    var sourceBalance = this.payment_list[this.transaction.sourceId - 1].balance; //get the source balance
    var transaction_amount = this.transaction.amount; //get the transaction amount
    if( this.transaction.type == 'transfer'){
      var destinationBalance = this.payment_list[this.transaction.destinationId - 1].balance; //if type = transfer we need the destination balance
    }
    // console.log('the transaction is: ', this.transaction);
    this.db.object('/users/'+this.user_id+'/transactions/'+this.transaction.id+'/').set(this.transaction);  //Store the transaction in the database
    this.db.list('/users/').update('/'+this.user_id+'/',{num_transactions:this.transaction.id + 1});  //Update the num_transactions of the user
    if(this.transaction_type == 'income'){
      this.setIncome(sourceBalance, transaction_amount);
    }else if(this.transaction_type == 'expenses'){
      this.setExpense(sourceBalance, transaction_amount);
    }else{
      this.setTransfer(sourceBalance, destinationBalance, transaction_amount);      
    }
  }

  setIncome(sourceBalance, transaction_amount){
    this.db.list('/users/').update('/'+this.user_id+'/payment/'+this.transaction.sourceId +'/',{balance: parseInt(sourceBalance) + (transaction_amount | 0)});  //Update the balance of the used payment method
  }

  setExpense(sourceBalance, transaction_amount){
    this.db.list('/users/').update('/'+this.user_id+'/payment/'+this.transaction.sourceId +'/',{balance: (sourceBalance - transaction_amount)});  //Reduce the balance of the used payment method
  }

  setTransfer(sourceBalance, destinationBalance, transaction_amount){
    this.db.list('/users/').update('/'+this.user_id+'/payment/'+this.transaction.sourceId +'/',{balance: (sourceBalance - transaction_amount)});  //Reduce the balance of the used payment method
    this.db.list('/users/').update('/'+this.user_id+'/payment/'+this.transaction.destinationId +'/',{balance: (sourceBalance + transaction_amount)});  //Increase the balance on the destination
  }

  //Setting the texfield values to the properties of our object
  setTransaction(transaction){
    transaction.id = this.items.num_transactions;
    transaction.datetime = new Date().toLocaleString();
    transaction.type = this.transaction_type;
    transaction.sourceId = this.payment_list[this.source_id - 1].id;
    transaction.amount = this.amount.value;
    if(this.transaction_type == 'expenses'){
      transaction.concept = this.concept.value;
      transaction.category = this.category_id;
    }else if(this.transaction_type == 'transfer'){
      transaction.destinationId = this.payment_list[this.destination_id - 1].id;
    }
  }

  //Function to get the type of user (the value will change everytime a different value is selected)
  getSourceId(id){
    this.source_id = id;
    this.source_mehtod = this.payment_list[id-1];
    console.log('The source method is: ', this.source_mehtod);
  }

  getDestinationId(id){
    this.destination_id = id;
    this.destination_mehtod = this.payment_list[id-1];
    console.log('The destination method is: ', this.destination_mehtod);
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

  //cancel transaction and return to home page
  cancelTransaction(){
    this.navCtrl.push(HomePage);
  }

  //Finish transaction and return to home page
  finishTransaction(){
    this.navCtrl.push(HomePage);
  }

}

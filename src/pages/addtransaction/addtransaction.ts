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
   payment_type;
   items;
   payment_list;
   user_id;

   //Litheral object constructor
  transaction = {concept : '', amount : '', paymentType : 0, datetime: '', id: 0};

   status_messages: string[] = ["Successfully registered transaction","The concept field is required", "The amount field is required", "There was a problem with the server"];

  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, private auth: AngularFireAuth, public alertCtrl: AlertController, private db: AngularFireDatabase,  private toast: ToastController) {
    this.user_id = this.auth.auth.currentUser.uid;
    this.loadPaymentMethods();
    this.loadUser();
  }

  //function to load the cards
  loadPaymentMethods(){
    this.db.list('/users/'+this.user_id+'/payment/').valueChanges().subscribe((d) => {
      this.payment_list = d;
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
    this.setTransaction(this.transaction);
    //Store the transaction in the database
    this.db.object('/users/'+this.user_id+'/transactions/'+this.transaction.id+'/').set(this.transaction);
    //Update the num_transactions of the user
    this.db.list('/users/').update('/'+this.user_id+'/',{num_transactions:this.transaction.id + 1});
  }

  //Setting the texfield values to the properties of our object
  setTransaction(transaction){
    transaction.id = this.items.num_transactions;
    transaction.concept = this.concept.value;
    transaction.amount = this.amount.value;
    transaction.paymentType = this.payment_type;
    transaction.datetime = new Date().toLocaleString()
  }

  //Function to get the type of user (the value will change everytime a different value is selected)
  getType(type){
    this.payment_type = type;
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

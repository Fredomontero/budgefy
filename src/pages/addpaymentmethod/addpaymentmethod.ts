import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

//Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

//My pages
import { PaymentPage } from '../payment/payment';


@IonicPage()
@Component({
  selector: 'page-addpaymentmethod',
  templateUrl: 'addpaymentmethod.html',
})
export class AddpaymentmethodPage {

  //Variables to get the value of the inputs
  @ViewChild('methodname') method_name;
  @ViewChild('accountnumber') account_number;
  @ViewChild('balance') balance;
  method_id;
  method_type;
  payment_list;
  user_id;

  //Litheral object constructor
  method = {id : 0 , name : '', type : 0, balance: 0, account_number: 0, status: 'active'};
  status_messages: string[] = ["Successfully registered method","The name field is required", "The balance field is required", "The account number field is required", "There was a problem with the server"];

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AngularFireAuth, private db: AngularFireDatabase, private toast: ToastController) {

  }

  ionViewWillEnter(){
    this.user_id = this.auth.auth.currentUser.uid;
    this.loadPaymentMethods();
  }

  loadPaymentMethods(){
    this.db.list('/users/'+this.user_id+'/payment/').valueChanges().subscribe((d) => {
      this.payment_list = d;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddpaymentmethodPage');
  }

  //Connection to Firebase and save the user
  addMethod(){
    this.setMethod(this.method);
    var error = this.validateForm(this.method);
    if(error == 0){
      this.db.object('/users/'+this.user_id+'/payment/'+this.method.id+'/').set(this.method)
      .then( data => {
        this.navCtrl.push(PaymentPage);
          this.displayStatus(error);
      })
      .catch(error => {
        error = 4;
        this.displayStatus(error);
      })
    }else{
      this.displayStatus(error);
    }
  }

  //Setting the texfield values to the properties of our object
  setMethod(method){
    method.id = this.payment_list.length + 1;
    method.name = this.method_name.value;
    method.balance = this.balance.value;
    method.status = "active";
    method.type = this.method_type;
    if(this.method_type > 2){
      this.method.account_number = this.account_number.value;
      //get the first char of the account number
      var type = parseInt(this.account_number.value.substring(0,1));
      if( this.method_type == 4)
        type += 10;;
      this.method.type = type;
    }
    method.status = "active";
  }

  //Function to get the type of user (the value will change everytime a different value is selected)
  getType(type){
    this.method_type = type;
  }

  //Verifying that the form is filled properly
  validateForm(method){
    var error = 0;
    if(method.name.length == 0){
      error = 1; 
    }else if(method.balance.length == 0){
      error = 2;
    }else if((method.type >  0)  && (method.account_number.length < 16)){
      error = 3;
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

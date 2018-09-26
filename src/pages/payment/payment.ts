import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

//Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { AddpaymentmethodPage } from '../addpaymentmethod/addpaymentmethod';


@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  //variables required
  user_id;
  payment_list;
  method = {description: '', type: 0};

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl:AlertController, private auth: AngularFireAuth, private db: AngularFireDatabase) {
    this.user_id = this.auth.auth.currentUser.uid;
    this.loadPaymentMethods();
  }

  ionViewDidLoad() {

  }

  //function to load the cards
  loadPaymentMethods(){
    this.db.list('/users/'+this.user_id+'/payment/').valueChanges().subscribe((d) => {
      this.payment_list = d;
    });
  }

  //function to present an AlertController and add a new card
  redirectToAddMethod(){
    this.navCtrl.push(AddpaymentmethodPage);
  }

}

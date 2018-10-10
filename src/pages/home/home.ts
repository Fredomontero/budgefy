import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { AddtransactionPage } from '../addtransaction/addtransaction';

//Firebase
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  username: string;
  payment_list;
  transaction_list;
  student;
  user_id;
  total: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private auth: AngularFireAuth, private menu: MenuController) {
    this.username = navParams.get('username');
    this.user_id = this.auth.auth.currentUser.uid;
    this.loadPaymentMethods();
    this.loadTransactions();
  }

  //function to load the cards
  loadPaymentMethods(){
    this.db.list('/users/'+this.user_id+'/payment/').valueChanges().subscribe((d) => {
      this.payment_list = d;
    });
  }

  //Function to load the transactions of the user and display them
  loadTransactions(){
    this.db.list('/users/'+this.user_id+'/transactions/').valueChanges().subscribe((d) => {
      this.transaction_list = d;
      let i = 0;
      for(i = 0; i<this.transaction_list.length; i++){
        if(this.transaction_list[i].type == 2){
          let amount = parseInt(this.transaction_list[i].amount);
          this.total = this.total+amount;
        }
      }
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

   //To open and close the menu
   toogleMenu(){
    this.menu.toggle();
  }

  //function to add more expenses
  addItem(){
    this.navCtrl.push(AddtransactionPage);
  }

}

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
  transaction_list;
  student;
  student_id;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private auth: AngularFireAuth, private menu: MenuController) {
    this.username = navParams.get('username');
    this.student_id = this.auth.auth.currentUser.uid;
    this.loadTransactions();
  }

  //Function to load the transactions of the user and display them
  loadTransactions(){
    this.db.list('/users/'+this.student_id+'/transactions/').valueChanges().subscribe((d) => {
      this.transaction_list = d;
      console.log(this.transaction_list);
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

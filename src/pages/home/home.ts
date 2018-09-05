import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  username: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private menu:MenuController) {
    this.username = navParams.get('username');
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
    console.log("Deseas ingresar un gasto?");
  }

}

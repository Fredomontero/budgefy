import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController } from 'ionic-angular';

//Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

//My pages
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  //Variables to get the value of the inputs
  @ViewChild('fullname') fullname;
  @ViewChild('email') email;
  @ViewChild('password1') password1;
  @ViewChild('password2') password2;

   //Litheral object constructor
   user = {name : '', email : '', num_transactions: 0};

   status_messages: string[] = ["Successfully registered user","The name field is required", "The email field is required", "Password don't match", "There was a problem with the server"];

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AngularFireAuth, private db: AngularFireDatabase, private toast: ToastController, private menu:MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  //Connection to Firebase and save the user and then login
  signIn(){
    this.setUser(this.user);
    var error = this.validateForm(this.user, this.password1, this.password2);
    if(error == 0){
      this.auth.auth.createUserWithEmailAndPassword(this.email.value, this.password1.value)
      .then( data => {
        //If the registration it's ok then sign in and insert user info into the db
        let id = this.auth.auth.currentUser.uid;
        this.db.object('/users/'+id+'/').set(this.user);
        this.auth.auth.signInWithEmailAndPassword(this.email.value, this.password1.value)
        .then( data => {
          this.navCtrl.push(HomePage);
          this.displayStatus(error);
        });
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
  setUser(user){
    user.name = this.fullname.value;
    user.email = this.email.value;
    user.num_transactions = 0;
  }

  //Verifying that the form is filled properly
  validateForm(user, password1, password2){
    var error = 0;
    if(user.name.length == 0){
      error = 1; 
    }else if(user.email.length == 0){
      error = 2;
    }else if((password1.value != password2.value)  || (password1.value.length < 8)){
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

  //To remove the swipe menu in this page
  ionViewDidEnter(){
    this.menu.swipeEnable(false);
  }

  //This is to let other pages to have access to the menu  
  ionViewWillLeave(){
    this.menu.swipeEnable(true);
  }

}

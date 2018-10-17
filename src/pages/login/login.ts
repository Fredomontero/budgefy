import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';

//This is what we need from firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//This are the pages required
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  //Variables to get the value of the inputs
  @ViewChild('email') email;
  @ViewChild('password') password;
  errorMessage: string;
  items;

  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, private auth: AngularFireAuth, public alertCtrl: AlertController, private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    
  }

  //login using the firebase authentication and sending the name to the home page
  login(){
    this.auth.auth.signInWithEmailAndPassword(this.email.value, this.password.value)
    // this.auth.auth.signInWithEmailAndPassword("chris@mail.com", "holamundo")
    .then(data => {
      let uid = this.auth.auth.currentUser.uid;
      var r = this.db.object('/users/'+uid+'/').valueChanges().subscribe((d) => {
        this.items = d;
        this.navCtrl.push(HomePage, {
          username: this.items.name
        });
      });
    })
    .catch(error => {
      this.displayErrorInfo(error);
    });
  }

  //Redirect to Singup page
  signup(){
    this.navCtrl.push(RegisterPage);
  }

  //Function to display the error message of a failed login
  displayErrorInfo(error: any){
    if(error.code == "auth/user-not-found"){
      this.errorMessage =  "Invalid email";
    }else{
      this.errorMessage = "Wrong password";
    }
    let alert = this.alertCtrl.create({
      title: 'error',
      subTitle: this.errorMessage,
      buttons: ['OK']
    });
    alert.present();
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

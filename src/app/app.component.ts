import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Firebase
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from '../pages/login/login';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  @ViewChild(Nav) navCtrl: Nav;
  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth, public alertCtrl: AlertController, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public menu: MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  //Function for loging out
  logout(){
    this.auth.auth.signOut();
    this.menu.close();
    this.navCtrl.push(LoginPage);
  }
}


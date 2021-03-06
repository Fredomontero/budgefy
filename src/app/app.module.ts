import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

//My pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { AddtransactionPage } from '../pages/addtransaction/addtransaction';
import { PaymentPage } from '../pages/payment/payment';
import { AddpaymentmethodPage } from '../pages/addpaymentmethod/addpaymentmethod';

//Firebase imports
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Components
import { FlowBarComponent } from '../components/flow-bar/flow-bar';

var config = {
  apiKey: "AIzaSyAq-hnJjVK-vz5W4h6yyDh84jR9vMWVAIk",
  authDomain: "budgefy-9c0df.firebaseapp.com",
  databaseURL: "https://budgefy-9c0df.firebaseio.com",
  projectId: "budgefy-9c0df",
  storageBucket: "budgefy-9c0df.appspot.com",
  messagingSenderId: "960056297953"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    AddtransactionPage,
    PaymentPage,
    AddpaymentmethodPage,
    FlowBarComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    IonicModule.forRoot(MyApp,{
      scrollPadding: false,
      scrollAssist: false
    }),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    AddtransactionPage,
    PaymentPage,
    AddpaymentmethodPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    AngularFireAuth,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

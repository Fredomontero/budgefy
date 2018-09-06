import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

//Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';


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
    console.log('ionViewDidLoad PaymentPage');
  }

  //function to load the cards
  loadPaymentMethods(){
    this.db.list('/users/'+this.user_id+'/payment/').valueChanges().subscribe((d) => {
      console.log(d);
      this.payment_list = d;
    });
  }

  //function to present an AlertController and add a new card
  addNewMethod() {
    let alert = this.alertCtrl.create({
      title: 'Add new method',
      inputs: [
        {
          name: 'name',
          placeholder: 'Description'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            this.method.description = data.name;
            let id = this.auth.auth.currentUser.uid;
            if(this.method.description.substring(0,1) == '5'){
              this.method.type = 1; //mastercard
            }else if(this.method.description.substring(0,1) == '4'){
              this.method.type = 2; //visa
            }else if(this.method.description.substring(0,1) == 'C' || this.method.description.substring(0,4) == 'c'){
              this.method.type = 3;//cash
            }else if(this.method.description.substring(0,1) == 'V' || this.method.description.substring(0,4) == 'v'){
              this.method.type = 4;//vouchers
            }
            this.db.object('/users/'+id+'/payment/'+this.method.description+'/').set(this.method);
          }
        }
      ]
    });
    alert.present();
  }

}

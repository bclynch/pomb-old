import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertService {

  constructor(
    private alertCtrl: AlertController
  ) { 

  }

  alert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title,
      message,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        }
      ]
    });
    alert.present(); 
  }
}
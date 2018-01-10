import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

interface Confirm {
  label: string;
  handler: () => void;
}

@Injectable()
export class AlertService {

  constructor(
    private alertCtrl: AlertController
  ) {

  }

  alert(title: string, message: string) {
    const alert = this.alertCtrl.create({
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

  confirm(title: string, message: string, confirmBtn: Confirm) {
    const alert = this.alertCtrl.create({
      title,
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: confirmBtn.label,
          handler: () => {
            confirmBtn.handler();
          }
        }
      ]
    });
    alert.present();
  }
}

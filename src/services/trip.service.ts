import { Injectable } from '@angular/core';
import { ModalController, ToastController } from 'ionic-angular';

import { TripModal } from '../components/modals/tripModal/tripModal';
import { APIService } from './api.service';

@Injectable()
export class TripService {

  constructor(
    private modalCtrl: ModalController,
    private apiService: APIService,
    private toastCtrl: ToastController
  ) { }

  createTrip() {
    let modal = this.modalCtrl.create(TripModal, {}, {cssClass: 'tripModal', enableBackdropDismiss: false});
    modal.onDidDismiss(data => {
      console.log(data);
      if(data) {
        this.toast(`New trip ${data.name} successfully created`);
      }
    });
    modal.present();
  }

  toast(message: string) {
    let toast = this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    }); 

    toast.present();
  }
}
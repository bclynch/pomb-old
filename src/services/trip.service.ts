import { Injectable } from '@angular/core';
import { ModalController, ToastController } from 'ionic-angular';

import { TripModal } from '../components/modals/tripModal/tripModal';
import { APIService } from './api.service';
import { UserService } from './user.service';

@Injectable()
export class TripService {

  constructor(
    private modalCtrl: ModalController,
    private apiService: APIService,
    private toastCtrl: ToastController,
    private userService: UserService
  ) { }

  createTrip() {
    const modal = this.modalCtrl.create(TripModal, {}, {cssClass: 'tripModal', enableBackdropDismiss: false});
    modal.onDidDismiss(data => {
      if (data) {
        this.apiService.createTrip(data.name, data.timeStart, data.timeEnd, data.bannerPath).subscribe(
          (result: any) => {
            this.apiService.createUserToTrip(this.userService.user.id, result.data.createTrip.trip.id).subscribe(
              () => {
                this.toast(`New trip '${data.name}' successfully created`);
              }
            );
          }
        );
      }
    });
    modal.present();
  }

  toast(message: string) {
    const toast = this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
}

import { Injectable } from '@angular/core';
import { ModalController, ToastController } from 'ionic-angular';

import { TripModal } from '../components/modals/tripModal/tripModal';
import { APIService } from './api.service';
import { UserService } from './user.service';

import { ImageType } from '../models/Image.model';

@Injectable()
export class TripService {

  displayTripNav: boolean;

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
        console.log(data);
        // creat trip
        this.apiService.createTrip(this.userService.user.id, data.name, data.timeStart, data.timeEnd, data.startLat, data.startLon).subscribe(
          (result: any) => {
            // save banner photos
            this.saveBannerPhotos(data.bannerImages, result.data.createTrip.trip.id).then(
              () => this.toast(`New trip '${data.name}' successfully created`)
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

  saveBannerPhotos(bannerPhotos: { url: string; title: string; }[], tripId: number) {
    return new Promise((resolve, reject) => {
      if (!bannerPhotos) resolve();

      // then bulk add links to post
      let query = `mutation {`;
      bannerPhotos.forEach((photo, i) => {
        query += `a${i}: createImage(
          input: {
            image: {
              tripId: ${tripId},
              userId: ${this.userService.user.id},
              type: ${ImageType['banner']},
              url: "${photo.url}",
              ${photo.title ? 'title: "' + photo.title + '"' : ''}
            }
          }) {
            clientMutationId
          }`;
      });
      query += `}`;

      this.apiService.genericCall(query).subscribe(
        result => resolve(result),
        err => console.log(err)
      );
    });
  }
}

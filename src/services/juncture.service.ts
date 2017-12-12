import { Injectable } from '@angular/core';
import { ModalController, ToastController } from 'ionic-angular';

import { JunctureModal } from '../components/modals/junctureModal/junctureModal';
import { APIService } from './api.service';

import { GalleryPhoto } from '../models/GalleryPhoto.model';

@Injectable()
export class JunctureService {

  constructor(
    private modalCtrl: ModalController,
    private apiService: APIService,
    private toastCtrl: ToastController
  ) { }

  createJuncture() {
    const modal = this.modalCtrl.create(JunctureModal, {}, {cssClass: 'junctureModal', enableBackdropDismiss: false});
    modal.onDidDismiss(data => {
      if (data) {
        this.apiService.reverseGeocodeCoords(data.location.lat, data.location.lon).subscribe(
          result => {
            // console.log(result);
            const city = result.formatted_address.split(',')[1];
            const country = result.formatted_address.split(',').slice(-1);

            this.apiService.updateJuncture(data.junctureId, data.name, data.time, data.description, data.location.lat, data.location.lon, city, country, data.saveType === 'Draft').subscribe(
              (result: any) => {
                console.log(result);
                this.createGalleryPhotoLinks(result.data.updateJunctureById.juncture.id, data.photos).then(() => {
                  this.apiService.createTripToJuncture(data.selectedTrip, result.data.updateJunctureById.juncture.id).subscribe(
                    () => {
                      this.toast(data.saveType === 'Draft' ? 'Juncture draft successfully saved' : 'Juncture successfully published');
                    }
                  );
                });
              }
            );
          }
        );
      }
    });
    modal.present();
  }

  createGalleryPhotoLinks(junctureId: number, photoArr: GalleryPhoto[]) {
    return new Promise((resolve, reject) => {
      if (!photoArr.length) resolve();

      // bulk add links to post
      let query = `mutation {`;
      photoArr.forEach((photo, i) => {
        query += `a${i}: createJunctureToPhoto(input:{
          junctureToPhoto:{
            junctureId: ${junctureId},
            photoUrl: "${photo.photoUrl}",
            description: "${photo.description}"
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

  toast(message: string) {
    const toast = this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
}

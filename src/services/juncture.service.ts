import { Injectable } from '@angular/core';
import { ModalController, ToastController } from 'ionic-angular';

import { JunctureModal } from '../components/modals/junctureModal/junctureModal';
import { APIService } from './api.service';
import { UserService } from './user.service';

import { GalleryPhoto } from '../models/GalleryPhoto.model';
import { ImageType } from '../models/Image.model';

@Injectable()
export class JunctureService {

  displayTripNav: boolean;
  defaultMarkerImg = 'https://www.imojado.org/wp-content/uploads/2016/08/1470289254_skylab-studio.png';
  defaultStartImg = 'https://pttaviation.com/wp-content/uploads/2014/07/PPT-Plane-Icon-220x220.png';

  constructor(
    private modalCtrl: ModalController,
    private apiService: APIService,
    private toastCtrl: ToastController,
    private userService: UserService
  ) { }

  createJuncture() {
    const modal = this.modalCtrl.create(JunctureModal, { markerImg: this.defaultMarkerImg }, { cssClass: 'junctureModal', enableBackdropDismiss: false });
    modal.onDidDismiss(data => {
      if (data) {
        this.apiService.reverseGeocodeCoords(data.location.lat, data.location.lon).subscribe(
          result => {
            // console.log(result);
            const city = result.formatted_address.split(',')[1].trim();
            const country = result.formatted_address.split(',').slice(-1)[0].trim();

            this.apiService.createJuncture(this.userService.user.id, data.selectedTrip, data.name, data.time, data.description, data.location.lat, data.location.lon, city, country, data.saveType === 'Draft', data.markerImg).subscribe(
              (result: any) => {
                console.log(result);
                // upload gpx data
                if (data.geoJSON) this.apiService.uploadGPX(data.geoJSON, result.data.createJuncture.juncture.id).subscribe(
                  jsonData => {
                    console.log(jsonData);
                    this.saveGalleryPhotos(result.data.createJuncture.juncture.id, data.photos, data.selectedTrip).then(() => {
                      this.toast(data.saveType === 'Draft' ? 'Juncture draft successfully saved' : 'Juncture successfully published');
                    });
                  },
                  err => console.log(err)
                );
              }
            );
          }
        );
      }
    });
    modal.present();
  }

  saveGalleryPhotos(junctureId: number, photoArr: GalleryPhoto[], tripId: number) {
    return new Promise((resolve, reject) => {
      if (!photoArr.length) resolve();

      // then bulk add links to post
      let query = `mutation {`;
      photoArr.forEach((photo, i) => {
        query += `a${i}: createImage(
          input: {
            image: {
              tripId: ${tripId},
              junctureId: ${junctureId}
              userId: ${this.userService.user.id},
              type: ${ImageType['gallery']},
              url: "${photo.photoUrl}",
              ${photo.description ? 'description: "' + photo.description + '"' : ''}
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

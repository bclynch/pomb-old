import { Injectable } from '@angular/core';
import { ModalController, ToastController } from 'ionic-angular';

import { TripModal } from '../components/modals/tripModal/tripModal';
import { APIService } from './api.service';
import { UserService } from './user.service';

import { ImageType } from '../models/Image.model';
import { Trip } from '../models/Trip.model';

@Injectable()
export class TripService {

  displayTripNav: boolean;

  constructor(
    private modalCtrl: ModalController,
    private apiService: APIService,
    private toastCtrl: ToastController,
    private userService: UserService
  ) { }

  openTripModal(tripId): Promise<void> {
    return new Promise((resolve, reject) => {
      const modal = this.modalCtrl.create(TripModal, { tripId }, {cssClass: 'tripModal', enableBackdropDismiss: false});
      modal.onDidDismiss(data => {
        if (data) {
          console.log(data);
          if (data.isExisting) {
            this.apiService.updateTrip(tripId, data.name, data.description, +data.timeStart, +data.timeEnd, data.startLat, data.startLon, this.userService.user.id).subscribe(
              result => {
                console.log(result);

                // update banner images as required
                this.comparePhotos(data.bannerImages, data.photoHasChanged, tripId).then(
                  result => resolve()
                );
              },
              err => {
                console.log(err);
                reject();
              }
            );
          } else {
            // create trip
            this.apiService.createTrip(this.userService.user.id, data.name, data.description, data.timeStart, data.timeEnd, data.startLat, data.startLon, this.userService.user.username).subscribe(
              (result: any) => {
                // save banner photos
                this.saveBannerPhotos(data.bannerImages, result.data.createTrip.trip.id).then(
                  () => {
                    this.toast(`New trip '${data.name}' successfully created`);
                    resolve();
                  },
                  err => reject()
                );
              }
            );
          }
        }
      });
      modal.present();
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

  saveBannerPhotos(bannerPhotos: { url: string; title: string; }[], tripId: number) {
    return new Promise((resolve, reject) => {
      if (!bannerPhotos.length) resolve();

      // then bulk add links to post
      let query = `mutation {`;
      bannerPhotos.forEach((photo, i) => {
        query += `a${i}: createImage(
          input: {
            image: {
              tripId: ${tripId},
              userId: ${this.userService.user.id},
              type: ${ImageType['BANNER']},
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

  // function returns what the nature of the trip is currently
  tripStatus(startDate: number, endDate: number): 'complete' | 'active' | 'upcoming' {
    // to be upcoming it must have a start date beyond current
    if (startDate > Date.now()) return 'upcoming';

    // to be complete it must have an end date and be in the past
    if (endDate && endDate < Date.now()) return 'complete';

    // otherwise it's active
    return 'active';
  }

  comparePhotos(photos, changedPhotos, tripId) {
    return new Promise((resolve, reject) => {
      const promiseArr = [];

      console.log(photos);

      // next check out if gallery photos are different
      // create arr of new photos (we can tell because they don't have an id yet)
      const newPhotoArr = photos.filter((img) => !img.id );
      this.saveBannerPhotos(newPhotoArr, tripId).then(
        result => {
          // update edited gallery photos
          // make sure 'new' photos not on 'edited' arr
          const filteredEditedArr = changedPhotos.filter((img => newPhotoArr.indexOf(img) === -1));
          console.log(filteredEditedArr);
          // then bulk update imgs
          if (filteredEditedArr.length) {
            let query = `mutation {`;
            filteredEditedArr.forEach((img, i) => {
              query += `a${i}: updateImageById(
                input: {
                  id: ${img.id},
                  imagePatch:{
                    url: "${img.url}",
                    description: "${img.description}"
                  }
                }
              ) {
                clientMutationId
              }
            `;
            });
            query += `}`;

            this.apiService.genericCall(query).subscribe(
              result => resolve(result),
              err => console.log(err)
            );
          } else {
            resolve();
          }
        }
      );
    });
  }
}

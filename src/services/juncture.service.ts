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

  openJunctureModal(junctureId): Promise<void> {
    return new Promise((resolve, reject) => {
      const modal = this.modalCtrl.create(JunctureModal, { markerImg: this.defaultMarkerImg, junctureId }, { cssClass: 'junctureModal', enableBackdropDismiss: false });
      modal.onDidDismiss(data => {
        console.log(data);
        if (data) {
          this.apiService.reverseGeocodeCoords(data.location.lat, data.location.lon).subscribe(
            result => {
              const city = this.extractCity(result.formattedAddress.address_components);
              const country = result.country.address_components[0].short_name;

              if (data.isExisting) {
                this.apiService.updateJuncture(junctureId, this.userService.user.id, data.selectedTrip, data.name, +data.time, data.description, data.location.lat, data.location.lon, city, country, data.saveType === 'Draft', data.markerImg).subscribe(
                  result => {
                    console.log(result);

                    // upload new gpx if requred
                    if (data.gpxChanged) {
                      this.apiService.uploadGPX(data.geoJSON, junctureId).subscribe(
                        jsonData => {
                          // update banner images as required
                          // console.log(data.bannerImages);
                          resolve();
                        },
                        err => {
                          console.log(err);
                          reject();
                        }
                      );
                    } else {
                      // update banner images as required
                      // console.log(data.bannerImages);
                      resolve();
                    }
                  },
                  err => {
                    console.log(err);
                    reject();
                  }
                );
              } else {
                this.apiService.createJuncture(this.userService.user.id, data.selectedTrip, data.name, data.time, data.description, data.location.lat, data.location.lon, city, country, data.saveType === 'Draft', data.markerImg).subscribe(
                  (result: any) => {
                    console.log(result);

                    // check setting to update user location -- if so update
                    if (this.userService.user.autoUpdateLocation) {
                      this.apiService.updateAccountById(
                        this.userService.user.id,
                        this.userService.user.firstName,
                        this.userService.user.lastName,
                        this.userService.user.userStatus,
                        this.userService.user.heroPhoto,
                        this.userService.user.profilePhoto,
                        city,
                        country,
                        this.userService.user.autoUpdateLocation
                      ).subscribe(
                        (result: any) => {
                          // set user service to new returned user
                          this.userService.user = result.data.updateAccountById.account;
                        }
                      );
                    }

                    // upload gpx data
                    if (data.geoJSON) {
                      this.apiService.uploadGPX(data.geoJSON, result.data.createJuncture.juncture.id).subscribe(
                        jsonData => {
                          console.log(jsonData);
                          this.saveGalleryPhotos(result.data.createJuncture.juncture.id, data.photos, data.selectedTrip).then(() => {
                            this.toast(data.saveType === 'Draft' ? 'Juncture draft successfully saved' : 'Juncture successfully published');
                            resolve();
                          });
                        },
                        err => {
                          console.log(err);
                          reject();
                        }
                      );
                    } else {
                      this.toast(data.saveType === 'Draft' ? 'Juncture draft successfully saved' : 'Juncture successfully published');
                    }
                  }
                );
              }
            }
          );
        }
      });
      modal.present();
    });
  }

  extractCity(addressComponents): string {
    for (let i = 0; i < addressComponents.length; i++) {
      for ( let j = 0; j < addressComponents[i].types.length; j++) {
        const type = addressComponents[i].types[j];
        // as its going down the list of places it will git the most specific one first and return the value
        if (type === 'locality' || type === 'administrative_area_level_2' || type === 'administrative_area_level_1' || type === 'country') {
          return addressComponents[i].long_name;
        }
      }
    }
    return null;
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
              type: ${ImageType['GALLERY']},
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

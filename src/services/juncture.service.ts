import { Injectable } from '@angular/core';
import { ModalController, ToastController } from 'ionic-angular';

import { JunctureModal } from '../components/modals/junctureModal/junctureModal';
import { APIService } from './api.service';
import { UserService } from './user.service';
import { UtilService } from './util.service';

import { GalleryPhoto } from '../models/GalleryPhoto.model';
import { ImageType } from '../models/Image.model';

@Injectable()
export class JunctureService {

  displayTripNav: boolean;
  defaultMarkerImg = 'https://www.imojado.org/wp-content/uploads/2016/08/1470289254_skylab-studio.png';
  defaultStartImg = '../assets/images/logo/logo96.png';

  constructor(
    private modalCtrl: ModalController,
    private apiService: APIService,
    private toastCtrl: ToastController,
    private userService: UserService,
    private utilService: UtilService
  ) { }

  openJunctureModal(junctureId): Promise<void> {
    return new Promise((resolve, reject) => {
      let country = null;
      const modal = this.modalCtrl.create(JunctureModal, { markerImg: this.defaultMarkerImg, junctureId }, { cssClass: 'junctureModal', enableBackdropDismiss: false });
      modal.onDidDismiss(data => {
        if (data) {
          this.apiService.reverseGeocodeCoords(data.location.lat, data.location.lon).subscribe(
            result => {
              console.log(result);
              const city = this.utilService.extractCity(result.formattedAddress.address_components);
              for (let i = 0; i < result.country.address_components.length; i++) {
                if (result.country.address_components[i].types.indexOf('country') !== -1) {
                  country = result.country.address_components[i].short_name;
                  break;
                }
              }

              // check if country exists in user list. If not then add
              this.checkCountry(country);

              if (data.isExisting) {
                this.apiService.updateJuncture(junctureId, this.userService.user.id, data.selectedTrip, data.type, data.name, +data.time, data.description, data.location.lat, data.location.lon, city, country, data.saveType === 'Draft', data.markerImg).subscribe(
                  result => {

                    // upload new gpx if requred
                    if (data.gpxChanged) {
                      this.apiService.uploadGPX(data.geoJSON, junctureId).subscribe(
                        jsonData => {
                          // update gallery images as required
                          this.comparePhotos(data.photos, data.changedPhotos, junctureId, data.selectedTrip).then(
                            result => resolve()
                          );
                        },
                        err => {
                          console.log(err);
                          reject();
                        }
                      );
                    } else {
                      // update banner images as required
                      this.comparePhotos(data.photos, data.changedPhotos, junctureId, data.selectedTrip).then(
                        result => resolve()
                      );
                      resolve();
                    }
                  },
                  err => {
                    console.log(err);
                    reject();
                  }
                );
              } else {
                this.apiService.createJuncture(this.userService.user.id, data.selectedTrip, data.type, data.name, data.time, data.description, data.location.lat, data.location.lon, city, country, data.saveType === 'Draft', data.markerImg, this.userService.user.username).subscribe(
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
                      this.saveGalleryPhotos(result.data.createJuncture.juncture.id, data.photos, data.selectedTrip).then(() => {
                        this.toast(data.saveType === 'Draft' ? 'Juncture draft successfully saved' : 'Juncture successfully published');
                        resolve();
                      });
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

  saveGalleryPhotos(junctureId: number, photoArr, tripId: number) {
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
              url: "${photo.url}",
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

  comparePhotos(photos, changedPhotos, junctureId: number, tripId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const promiseArr = [];

      // next check out if gallery photos are different
      // create arr of new photos (we can tell because they don't have an id yet)
      const newPhotoArr = photos.filter((img) => !img.id );
      this.saveGalleryPhotos(junctureId, newPhotoArr, tripId).then(
        result => {
          // update edited gallery photos
          // make sure 'new' photos not on 'edited' arr
          const filteredEditedArr = changedPhotos.filter((img => newPhotoArr.indexOf(img) === -1));
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

  toast(message: string) {
    const toast = this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  checkCountry(country: string) {
    // if option is toggled on
    if (this.userService.user.autoUpdateVisited) {
      // create nicer arr to work with
      const countriesVisited = this.userService.user.userToCountriesByUserId.nodes.map((country) => (country.countryByCountry.code));
      console.log(country);
      // if country code doesn't exist then add it
      if (countriesVisited.indexOf(country) === -1) {
        this.apiService.createUserToCountry(country, this.userService.user.id).subscribe(
          result => {},
          err => console.log(err)
        );
      }
    }
  }
}

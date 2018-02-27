import { Component } from '@angular/core';
import { PopoverController, ToastController } from 'ionic-angular';

import { SettingsService } from '../../../../services/settings.service';
import { BroadcastService } from '../../../../services/broadcast.service';
import { APIService } from '../../../../services/api.service';
import { UserService } from '../../../../services/user.service';

import { GradientPopover } from '../../../../components/popovers/gradient/gradientPopover.component';
import { ImageUploaderPopover } from '../../../../components/popovers/imageUploader/imageUploaderPopover.component';

@Component({
  selector: 'page-useradmin-config',
  templateUrl: 'config.html'
})
export class UserAdminConfigPage {

  profileModel = { firstName: null, lastName: null, userStatus: null, heroBanner: null, userPhoto: null };
  locationModel = { city: null, country: null, autoUpdate: null };

  defaultBannerImg = 'https://www.yosemitehikes.com/images/wallpaper/yosemitehikes.com-bridalveil-winter-1200x800.jpg';

  autoUpdateVisited;
  visitedCountries: { code: string; name: string; }[] = [];

  constructor(
    private broadcastService: BroadcastService,
    private settingsService: SettingsService,
    private popoverCtrl: PopoverController,
    private apiService: APIService,
    private toastCtrl: ToastController,
    private userService: UserService
  ) {
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    // populate inputs
    this.profileModel.firstName = this.userService.user.firstName;
    this.profileModel.lastName = this.userService.user.lastName;
    this.profileModel.userStatus = this.userService.user.userStatus;
    this.profileModel.userPhoto = this.userService.user.profilePhoto;
    this.profileModel.heroBanner = this.userService.user.heroPhoto;

    this.locationModel.city = this.userService.user.city;
    this.locationModel.country = this.userService.user.country;
    this.locationModel.autoUpdate = this.userService.user.autoUpdateLocation;

    this.visitedCountries = this.userService.user.userToCountriesByUserId.nodes.map((country) => ({ code: country.countryByCountry.code.toLowerCase(), name: country.countryByCountry.name }));
    this.autoUpdateVisited = this.userService.user.autoUpdateVisited;
  }

  presentImageUploaderPopover(type: string) {
    const size = type === 'banner' ? { width: 1200, height: 300 } : null;
    const popover = this.popoverCtrl.create(ImageUploaderPopover, { type, size }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
    popover.present();
    popover.onDidDismiss((data) => {
      if (data) {
        type === 'banner' ? this.profileModel.heroBanner = data[0].url : this.profileModel.userPhoto = data[0].url;
      }
    });
  }

  updateProfile() {
    this.apiService.updateAccountById(
      this.userService.user.id,
      this.profileModel.firstName,
      this.profileModel.lastName,
      this.profileModel.userStatus,
      this.profileModel.heroBanner,
      this.profileModel.userPhoto,
      this.userService.user.city,
      this.userService.user.country,
      this.userService.user.autoUpdateLocation
    ).subscribe(
      (result: any) => {
        // set user service to new returned user
        this.userService.user = result.data.updateAccountById.account;

        const toast = this.toastCtrl.create({
          message: `Profile updated`,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      },
      err => console.log(err)
    );
  }

  updateLocation() {
    this.apiService.updateAccountById(
      this.userService.user.id,
      this.userService.user.firstName,
      this.userService.user.lastName,
      this.userService.user.userStatus,
      this.userService.user.heroPhoto,
      this.userService.user.profilePhoto,
      this.locationModel.city,
      this.locationModel.country,
      this.locationModel.autoUpdate
    ).subscribe(
      (result: any) => {
        // set user service to new returned user
        this.userService.user = result.data.updateAccountById.account;

        const toast = this.toastCtrl.create({
          message: `Location updated`,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    );
  }

  addCountry(country) {
    console.log(country);
    const selectedCountry = { code: country.code.toLowerCase(), name: country.name };
    if (this.visitedCountries.map((country) => (country.code)).indexOf(selectedCountry.code) === -1) this.visitedCountries.push(selectedCountry);
  }

  removeCountry(index: number) {
    this.visitedCountries.splice(index, 1);
  }

  updateCountries() {
    // checking for dif between arrays
    const diffExisting = this.userService.user.userToCountriesByUserId.nodes.filter(x => this.visitedCountries.map((countryToSave) => countryToSave.name).indexOf(x.countryByCountry.name) < 0);
    console.log(diffExisting); // remove country
    const moddedExisting = this.userService.user.userToCountriesByUserId.nodes.map((value) => value.countryByCountry.name );
    const diffNew = this.visitedCountries.filter(x => moddedExisting.indexOf(x.name) < 0);
    console.log(diffNew); // add country

    // if no changes resolve
    if (!diffExisting.length && !diffNew.length) return;

    const promiseArr = [];

    // if diff new need to add
    if (diffNew.length) {
      const promise = new Promise((resolve, reject) => {
        // then bulk add tag to post
        let query = `mutation {`;
        diffNew.forEach((country, i) => {
          query += `a${i}: createUserToCountry(
            input: {
              userToCountry: {
                country: "${country.code.toUpperCase()}",
                userId: ${this.userService.user.id}
              }
            }) {
              clientMutationId
            }
        `;
        });
        query += `}`;

        this.apiService.genericCall(query).subscribe(
          result => resolve(result),
          err => reject(err)
        );
      });
      promiseArr.push(promise);
    }

    // // Has diff existing so run a for each and delete
    if (diffExisting.length) {
      const promise = new Promise((resolve, reject) => {
        let query = `mutation {`;
        diffExisting.forEach((country, i) => {
          query += `a${i}: deleteUserToCountryById(
            input: {
              id: ${country.id}
            }) {
              clientMutationId
            }
        `;
        });
        query += `}`;

        this.apiService.genericCall(query).subscribe(
          result => resolve(),
          err => reject(err)
        );
      });
      promiseArr.push(promise);
    }

    Promise.all(promiseArr).then(
      result => {
        const toast = this.toastCtrl.create({
          message: `Visited Countries updated`,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    );
  }
}

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
}

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

  configModel = { primaryColor: null, secondaryColor: null, tagline: null, heroBanner: null, userPhoto: null };

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
    this.configModel.userPhoto = this.userService.user.profilePhoto;
    this.configModel.primaryColor = this.settingsService.primaryColor;
    this.configModel.secondaryColor = this.settingsService.secondaryColor;
    this.configModel.tagline = this.settingsService.tagline;
    this.configModel.heroBanner = this.settingsService.heroBanner;
  }

  presentGradientPopover(e: Event) {
    const popover = this.popoverCtrl.create(GradientPopover, {}, { cssClass: 'gradientPopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      if (data) {
        this.configModel.primaryColor = data.primaryColor;
        this.configModel.secondaryColor = data.secondaryColor;
      }
    });
  }

  presentImageUploaderPopover(type: string) {
    const size = type === 'banner' ? { width: 1200, height: 300 } : null;
    const popover = this.popoverCtrl.create(ImageUploaderPopover, { type, size }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
    popover.present();
    popover.onDidDismiss((data) => {
      if (data) {
        type === 'banner' ? this.configModel.heroBanner = data[0].url : this.configModel.userPhoto = data[0].url;
      }
    });
  }

  saveConfig() {
    this.apiService.updateConfig(this.configModel.primaryColor, this.configModel.secondaryColor, this.configModel.tagline, this.configModel.heroBanner)
    .subscribe(() => {
      this.settingsService.primaryColor = this.configModel.primaryColor;
      this.settingsService.secondaryColor = this.configModel.secondaryColor;
      this.settingsService.tagline = this.configModel.tagline;
      this.settingsService.heroBanner = this.configModel.heroBanner;

      // probably need to put this in a settings menu eventually...
      const user = this.userService.user;
      this.apiService.updateAccountById(user.id, user.firstName, user.lastName, user.heroPhoto, this.configModel.userPhoto).subscribe(
        (result: any) => {
          // set user service to new returned user
          this.userService.user = result.data.updateAccountById.account;

          const toast = this.toastCtrl.create({
            message: `New site settings saved`,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      );
    });
  }
}

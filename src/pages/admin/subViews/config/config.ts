import { Component } from '@angular/core';
import { PopoverController, ToastController } from 'ionic-angular';

import { SettingsService } from '../../../../services/settings.service';
import { BroadcastService } from '../../../../services/broadcast.service';
import { APIService } from '../../../../services/api.service';

import { GradientPopover } from '../../../../components/popovers/gradient/gradientPopover.component';
import { ImageUploaderPopover } from '../../../../components/popovers/imageUploader/imageUploaderPopover.component';

@Component({
  selector: 'page-admin-config',
  templateUrl: 'config.html'
})
export class AdminConfigPage {

  styleModel = { primaryColor: null, secondaryColor: null, tagline: null, heroBanner: null };

  constructor(
    private broadcastService: BroadcastService,
    private settingsService: SettingsService,
    private popoverCtrl: PopoverController,
    private apiService: APIService,
    private toastCtrl: ToastController,
  ) {
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    this.styleModel.primaryColor = this.settingsService.primaryColor;
    this.styleModel.secondaryColor = this.settingsService.secondaryColor;
    this.styleModel.tagline = this.settingsService.tagline;
    this.styleModel.heroBanner = this.settingsService.heroBanner;
  }

  presentGradientPopover(e: Event) {
    const popover = this.popoverCtrl.create(GradientPopover, {}, { cssClass: 'gradientPopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      if (data) {
        this.styleModel.primaryColor = data.primaryColor;
        this.styleModel.secondaryColor = data.secondaryColor;
      }
    });
  }

  presentImageUploaderPopover() {
    const popover = this.popoverCtrl.create(ImageUploaderPopover, { type: 'banner', size: { width: 1200, height: 300 } }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
    popover.present();
    popover.onDidDismiss((data) => {
      if (data) this.styleModel.heroBanner = data[0].url;
    });
  }

  updateStyle() {
    this.apiService.updateConfig(this.styleModel.primaryColor, this.styleModel.secondaryColor, this.styleModel.tagline, this.styleModel.heroBanner).subscribe(
      () => {
        this.settingsService.primaryColor = this.styleModel.primaryColor;
        this.settingsService.secondaryColor = this.styleModel.secondaryColor;
        this.settingsService.tagline = this.styleModel.tagline;
        this.settingsService.heroBanner = this.styleModel.heroBanner;

        const toast = this.toastCtrl.create({
          message: `New site settings saved`,
          duration: 3000,
          position: 'top'
        });

        toast.present();
      });
  }
}

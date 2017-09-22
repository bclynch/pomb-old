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

  configModel = { primaryColor: null, secondaryColor: null, tagline: null, heroBanner: null };

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
    this.configModel.primaryColor = this.settingsService.primaryColor;
    this.configModel.secondaryColor = this.settingsService.secondaryColor;
    this.configModel.tagline = this.settingsService.tagline;
    this.configModel.heroBanner = this.settingsService.heroBanner;
  }

  presentGradientPopover(e: Event) {
    let popover = this.popoverCtrl.create(GradientPopover, {}, { cssClass: 'gradientPopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      if(data) {
        this.configModel.primaryColor = data.primaryColor;
        this.configModel.secondaryColor = data.secondaryColor;
      }
    });
  }

  presentImageUploaderPopover() {
    let popover = this.popoverCtrl.create(ImageUploaderPopover, { type: 'banner' }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
    popover.present();
    popover.onDidDismiss((data) => {
      if(data) this.configModel.heroBanner = data.url;
    });
  }

  saveConfig() {
    this.apiService.updateConfig(this.configModel.primaryColor, this.configModel.secondaryColor, this.configModel.tagline, this.configModel.heroBanner)
    .subscribe(() => {
      this.settingsService.primaryColor = this.configModel.primaryColor;
      this.settingsService.secondaryColor = this.configModel.secondaryColor;
      this.settingsService.tagline = this.configModel.tagline;
      this.settingsService.heroBanner = this.configModel.heroBanner;

      let toast = this.toastCtrl.create({
        message: `New site settings saved`,
        duration: 3000,
        position: 'top'
      }); 
  
      toast.present();
    });
  }
}
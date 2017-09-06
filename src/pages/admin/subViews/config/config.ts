import { Component } from '@angular/core';
import { PopoverController } from 'ionic-angular';

import { SettingsService } from '../../../../services/settings.service';
import { BroadcastService } from '../../../../services/broadcast.service';

import { GradientPopover } from '../../../../components/popovers/gradient/gradientPopover.component';

@Component({
  selector: 'page-admin-config',
  templateUrl: 'config.html'
})
export class AdminConfigPage {

  configModel = { primaryColor: null, secondaryColor: null };

  constructor(
    private broadcastService: BroadcastService,
    private settingsService: SettingsService,
    private popoverCtrl: PopoverController
  ) {  
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init()); 
  }

  init() {
    this.configModel.primaryColor = this.settingsService.primaryColor;
    this.configModel.secondaryColor = this.settingsService.secondaryColor;
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
}
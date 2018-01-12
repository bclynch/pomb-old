import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
 selector: 'page-settings',
 templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
  ) {
    this.settingsService.appInited ? console.log('neat') : this.broadcastService.on('appIsReady', () => console.log('neat'));
  }
}

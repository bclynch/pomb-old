import { Component } from '@angular/core';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  selector: 'page-construction',
  templateUrl: 'construction.html'
})
export class ConstructionPage {

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
  ) {
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {

  }
}

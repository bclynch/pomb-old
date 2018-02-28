import { Component } from '@angular/core';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html'
})
export class TermsPage {

  activeTab: 'terms' | 'privacy';

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private routerService: RouterService
  ) {
    this.activeTab = this.routerService.fragment || 'terms';
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {

  }

  changeTab(tab: 'terms' | 'privacy') {
    this.routerService.modifyFragment(tab);
    this.activeTab = tab;
  }
}

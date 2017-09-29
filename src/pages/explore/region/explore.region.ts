import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { ExploreService } from '../../../services/explore.service';
import { BroadcastService } from '../../../services/broadcast.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'page-explore-region',
  templateUrl: 'explore.region.html'
})
export class ExploreRegionPage {

  countryCodes: string[][];
  inited = false;
  region: string;

  constructor(
    private apiService: APIService,
    private router: Router,
    private settingsService: SettingsService,
    private exploreService: ExploreService,
    private broadcastService: BroadcastService,
    private routerService: RouterService
  ) {  
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init()); 
  }

  init() {
    //grab region name
    const region = this.routerService.baseURL.split('/').slice(-1)[0];
    this.region = this.exploreService.getGoogleCodeByName(region);
    console.log(this.region);

    //check if its a region or subregion
    if(Object.keys(this.exploreService.regions).indexOf(region) === -1) {
      //we know its a subregion. Need to find its parent to include for grabbing codes
      this.countryCodes = this.exploreService.requestCountryCodes(null, region);
    } else {
      this.countryCodes = this.exploreService.requestCountryCodes(region);
    }
    this.inited = true;
  }
}

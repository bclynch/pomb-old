import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { APIService } from '../../services/api.service';
import { JunctureService } from '../../services/juncture.service';

@Component({
 selector: 'page-trip-timeline',
 templateUrl: 'tripTimeline.html'
})
export class TripTimelinePage {

  tripId: number;
  tripData;

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private router: Router,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private junctureService: JunctureService
  ) {
    this.tripId = +this.router.url.split('/')[2];
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    this.apiService.getTripById(this.tripId).subscribe(({ data }) => {
      this.tripData = data.tripById;
      console.log('got trip data: ', this.tripData);
    });
  }
}

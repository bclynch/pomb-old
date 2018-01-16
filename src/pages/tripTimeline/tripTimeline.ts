import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    private junctureService: JunctureService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.tripId = params.id;
      this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
    });
  }

  init() {
    this.apiService.getTripById(this.tripId).subscribe(({ data }) => {
      this.tripData = data.tripById;
      console.log('got trip data: ', this.tripData);
    });
  }
}

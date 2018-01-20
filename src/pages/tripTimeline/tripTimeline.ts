import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { APIService } from '../../services/api.service';
import { JunctureService } from '../../services/juncture.service';
import { RouterService } from '../../services/router.service';

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
    private route: ActivatedRoute,
    private routerService: RouterService
  ) {
    this.route.params.subscribe((params) => {
      this.tripId = params.id;
      this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
    });
  }

  init() {
    this.apiService.getTripById(this.tripId).valueChanges.subscribe(({ data }) => {
      this.tripData = data.tripById;
      console.log('got trip data: ', this.tripData);
    });
  }

  scrollTo(option: string) {
    document.getElementById(option).scrollIntoView({behavior: 'smooth'});
  }

  rangeChange(e) {
    if (e._value !== 0) this.scrollTo(`juncture${e._value - 1}`);
  }

  junctureImage(juncture) {
    return juncture.junctureByJunctureId.markerImg || this.junctureService.defaultMarkerImg;
  }
}

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { APIService } from '../../services/api.service';
import { JunctureService } from '../../services/juncture.service';
import { RouterService } from '../../services/router.service';
import { UserService } from '../../services/user.service';

import { Trip } from '../../models/Trip.model';

@Component({
 selector: 'page-trip-timeline',
 templateUrl: 'tripTimeline.html'
})
export class TripTimelinePage {

  tripId: number;
  tripData: Trip;

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private router: Router,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private junctureService: JunctureService,
    private route: ActivatedRoute,
    private routerService: RouterService,
    private userService: UserService
  ) {
    this.route.params.subscribe((params) => {
      this.tripId = params.tripId;
      this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
    });
  }

  init() {
    this.apiService.getTripById(this.tripId, this.userService.user ? this.userService.user.id : null).valueChanges.subscribe(({ data }) => {
      this.tripData = data.tripById;
      console.log('got trip data: ', this.tripData);
      this.settingsService.modPageMeta(`${this.tripData.name} Timeline`, `Follow along and see the junctures that made ${this.tripData.name} an experience of a lifetime.`);
    });
  }

  scrollTo(option: string) {
    document.getElementById(option).scrollIntoView({behavior: 'smooth'});
  }

  rangeChange(e) {
    if (e._value !== 0) this.scrollTo(`juncture${e._value - 1}`);
  }

  junctureImage(juncture) {
    return juncture.markerImg || this.junctureService.defaultMarkerImg;
  }
}

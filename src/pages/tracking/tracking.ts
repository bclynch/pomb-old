import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { APIService } from '../../services/api.service';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { UserService } from '../../services/user.service';
import { TripService } from '../../services/trip.service';
import { UtilService } from '../../services/util.service';

import { User } from '../../models/User.model';
import { Trip } from '../../models/Trip.model';

interface TrackedTrip { user: User; trip: Trip; }

@Component({
  selector: 'page-tracking',
  templateUrl: 'tracking.html'
})
export class TrackingPage {

  inited = false;

  upcomingTrips: TrackedTrip[] = [];
  activeTrips: TrackedTrip[] = [];
  completeTrips: TrackedTrip[] = [];

  containers: { label: string; arr: TrackedTrip[]; }[] = [
    { label: 'Upcoming Trips', arr: this.upcomingTrips },
    { label: 'Active Trips', arr: this.activeTrips },
    { label: 'Completed Trips', arr: this.completeTrips }
  ];

  constructor(
    private apiService: APIService,
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private router: Router,
    private userService: UserService,
    private tripService: TripService,
    private utilService: UtilService,
    private sanitizer: DomSanitizer
  ) {
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    this.apiService.getUserTrackedTrips(this.userService.user.username).valueChanges.subscribe(
      result => {
        const trackingData = result.data.accountByUsername.tracksByUserId.nodes;
        console.log(trackingData);
        trackingData.forEach((user) => {
          user.accountByTrackUserId.tripsByUserId.nodes.forEach((trip) => {
            switch (this.tripService.tripStatus(+trip.startDate, trip.endDate ? +trip.endDate : null)) {
              case 'active':
                this.activeTrips.push({ user, trip });
                break;
              case 'complete':
                this.completeTrips.push({ user, trip });
                break;
              case 'upcoming':
                this.upcomingTrips.push({ user, trip });
                break;
            }
          });
        });
        this.inited = true;
      }
    );
  }

  calcStart(start: number): number {
    return this.utilService.differenceDays(Date.now(), start);
  }
}

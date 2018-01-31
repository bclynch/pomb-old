import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';
import { UtilService } from '../../services/util.service';

import { Trip } from '../../models/Trip.model';

@Component({
  selector: 'TripCard',
  templateUrl: 'tripCard.component.html'
})
export class TripCard {
  @Input() trip: Trip;

  defaultPhoto = '../../assets/images/trip-default.jpg';

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private router: Router,
    private utilService: UtilService
  ) { }

  navigateToTrip() {
    this.routerService.navigateToPage(`/trip/${this.trip.id}`);
  }

  daysTraveling() {
    const days = this.utilService.differenceDays(this.trip.startDate, this.trip.endDate);
    return days === 1 ? `${days} day` : `${days} days`;
  }
}

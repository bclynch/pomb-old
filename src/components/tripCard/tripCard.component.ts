import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'TripCard',
  templateUrl: 'tripCard.component.html'
})
export class TripCard {
  @Input() trip;

  defaultPhoto = '../../assets/images/trip-default.jpg';

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private router: Router
  ) { }

  navigateToTrip() {
    this.routerService.navigateToPage(`${this.router.url}/trip/${this.trip.id}`);
  }

  daysTraveling() {
    let timeDiff: number;
    if (this.trip.endDate) {
      timeDiff = this.trip.endDate - this.trip.startDate;
    } else {
      timeDiff = Date.now() - this.trip.startDate;
    }
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return days === 1 ? `${days} day` : `${days} days`;
  }
}

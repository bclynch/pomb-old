import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { APIService } from '../../../../services/api.service';
import { UserService } from '../../../../services/user.service';
import { SettingsService } from '../../../../services/settings.service';
import { BroadcastService } from '../../../../services/broadcast.service';
import { UtilService } from '../../../../services/util.service';
import { RouterService } from '../../../../services/router.service';
import { TripService } from '../../../../services/trip.service';
import { JunctureService } from '../../../../services/juncture.service';

import { Trip } from '../../../../models/Trip.model';

@Component({
  selector: 'page-useradmin-trips',
  templateUrl: 'trips.html'
})
export class UserAdminTripsPage {

  tripsQuery;
  tripsData: Trip[];
  activeTrip: number = null;

  constructor(
    private apiService: APIService,
    private userService: UserService,
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private utilService: UtilService,
    private routerService: RouterService,
    private sanitizer: DomSanitizer,
    private tripService: TripService,
    private junctureService: JunctureService
  ) {
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    // splitting up to refetch below on edits
    this.tripsQuery = this.apiService.getTripsUserDashboard(this.userService.user.id);
    this.tripsQuery.valueChanges.subscribe(
      result => {
        this.tripsData = result.data.allTrips.nodes;
        console.log(this.tripsData);
      }
    );
  }

  daysTraveling(index: number) {
    const days = this.utilService.differenceDays(this.tripsData[index].startDate, this.tripsData[index].endDate);
    return days === 1 ? `${days} day` : `${days} days`;
  }

  editTrip(index: number) {
    this.tripService.openTripModal(this.tripsData[index].id).then(
      result => this.tripsQuery.refetch()
    );
  }

  editJuncture(index: number) {
    this.junctureService.openJunctureModal(this.tripsData[this.activeTrip].juncturesByTripId.nodes[index].id).then(
      result => this.tripsQuery.refetch()
    );
  }
}

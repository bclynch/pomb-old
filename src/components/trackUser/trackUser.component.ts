import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { APIService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'TrackUser',
  templateUrl: 'trackUser.component.html'
})
export class TrackUser implements OnChanges {
  @Input() trackUserId: number;

  displayComponent = true;
  isTracking = false;
  trackingId: number;

  constructor(
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
    private apiService: APIService,
    private userService: UserService,
    private alertService: AlertService
  ) {

  }

  ngOnChanges() {
    if (this.userService.user) {
      if (this.trackUserId === this.userService.user.id) this.displayComponent = false;
      this.apiService.checkTrackingByUser(this.trackUserId, this.userService.user.id).valueChanges.subscribe(
        result => {
          if (result.data.accountById.tracksByTrackUserId.nodes.length) {
            this.isTracking = true;
            this.trackingId = result.data.accountById.tracksByTrackUserId.nodes[0].id;
          }
        },
        err => console.log(err)
      );
    } else {
      this.displayComponent = false;
    }
  }

  trackUser() {
    if (!this.userService.user.id) {
      this.alertService.alert('Tracking Error', 'Please login in order to track users');
      return;
    } else {
      this.apiService.createTrack(this.userService.user.id, this.trackUserId).subscribe(
        result => {
          console.log(result);
          this.isTracking = true;
        }
      );
    }
  }

  unTrackUser() {
    this.apiService.deleteTrackById(this.trackingId).subscribe(
      result => {
        this.isTracking = false;
      }
    );
  }
}

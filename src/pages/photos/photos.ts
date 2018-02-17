import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { APIService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-photos',
  templateUrl: 'photos.html'
})
export class PhotosPage {

  tripId: number;
  isTrip = false;

  userId: number;

  callQuant = 12;
  index = 0;

  gallery = [];

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private route: ActivatedRoute,
    private apiService: APIService,
    private utilService: UtilService,
    private sanitizer: DomSanitizer,
    private userService: UserService
  ) {
    this.route.params.subscribe((params) => {
      // photos page will either be all photos from a trip or all from a user
      // maybe eventually it would be cool to grab photos from locales or tags, but for now this works
      if (params.username) {
        this.settingsService.modPageMeta(`Photos By ${params.username}`, `All photos taken by ${params.username}`);
        this.apiService.getAccountByUsername(params.username, this.userService.user ? this.userService.user.id : null).valueChanges.subscribe(({ data }) => {
          const user = data.accountByUsername;
          console.log(user);
          this.userId = user.id;
        }, (error) => {
          console.log('there was an error sending the query', error);
        });
      } else if (params.tripId) {
        this.settingsService.modPageMeta(`Trip Photos`, `All trip photos`);
        this.tripId = params.tripId;
        this.isTrip = true;
      }

      this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
    });

    // subscribing to infiniteActive
    this.utilService.infiniteActive$.subscribe(() => {
      console.log('INFINITE ACTIVE', this.utilService.infiniteActive);
      if (this.utilService.infiniteActive) {
        setTimeout(() => this.loadMoreImages(), 500);
      }
    });
  }

  init() {
    // this gets turned off on router changes so we turn on here to hook knto our scroll directive
    this.utilService.checkScrollInfinite = true;
    this.utilService.allFetched = false;

    this.loadMoreImages();
  }

  loadMoreImages() {
    console.log('load more');
    if (this.isTrip) {
      this.apiService.getAllImagesByTrip(this.tripId, this.callQuant, this.index, this.userService.user ? this.userService.user.id : null).valueChanges.subscribe(
        result => {
          console.log(result);
          this.gallery = this.gallery.concat(result.data.allImages.nodes);
          if (result.data.allImages.nodes < this.callQuant) this.utilService.allFetched = true;
        }
      );
    } else {
      this.apiService.getAllImagesByUser(this.userId, this.callQuant, this.index).valueChanges.subscribe(
        result => {
          console.log(result);
          this.gallery = this.gallery.concat(result.data.allImages.nodes);
          if (result.data.allImages.nodes < this.callQuant) this.utilService.allFetched = true;
        }
      );
    }

    this.index += 12;
    // setting a timeout so it doesn't fire another call right away
    setTimeout(() => this.utilService.toggleInfiniteActive(false), 3000);
  }
}

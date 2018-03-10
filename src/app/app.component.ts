import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastController } from 'ionic-angular';

import { APIService } from '../services/api.service';
import { LocalStorageService } from '../services/localStorage.service';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';
import { SettingsService } from '../services/settings.service';
import { AnalyticsService } from '../services/analytics.service';
import { BroadcastService, BroadcastEvent } from '../services/broadcast.service';

@Component({
  templateUrl: 'app.html'
})
export class PackOnMyBack implements OnInit, OnDestroy {

  firstTry = true;

  constructor(
    private apiService: APIService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private alertService: AlertService,
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private anaylticsService: AnalyticsService,
    private toastCtrl: ToastController
  ) {
    // grab site config
    this.settingsService.appInit().then(() => {
      this.settingsService.appInited = true;

      this.apiService.getCurrentAccount().valueChanges.subscribe(({ data }) => {
        // checking in to snag user data
        console.log('got user data', data);
        if (data.currentAccount) {
          this.userService.signedIn = true;
          this.userService.user = data.currentAccount;
          this.userService.init().then(() => {
            this.emitReady();
            this.firstTry = false;
          });
        } else {
          // if it doesnt exist dump the token
          if (this.firstTry) this.localStorageService.set('pomb-user', null);
          this.emitReady();
          this.firstTry = false;
        }
      }, (error) => {
        console.log('there was an error sending the query', error);
        this.localStorageService.set('pomb-user', null);
        // alertService.alert('Internal Error', 'There was a problem with our servers, please be patient!');
        this.emitReady();
      });
    }, error => {
      console.log(error);
      // JWT expired so get rid of it in local storage
      this.localStorageService.set('pomb-user', null);
      this.emitReady();
      // window.location.reload();
    });
  }

  // analytics tracking
  ngOnInit() {
    this.anaylticsService.trackViews();

    // listen to the service worker promise in index.html to see if there has been a new update.
    // condition: the service-worker.js needs to have some kind of change - e.g. increment CACHE_VERSION.
    window['isUpdateAvailable']
    .then(isAvailable => {
      if (isAvailable) {
        const toast = this.toastCtrl.create({
          message: 'New updates available! Reload Pack On My Back to see the latest.',
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'Reload'
        });
        toast.present();
        toast.onDidDismiss(() => {
          window.location.reload();
        });
      }
    });
  }

  ngOnDestroy() {
    this.anaylticsService.destroyTracking();
  }

  emitReady() {
    // app ready to init
    const broadcastEvent: BroadcastEvent = { name: 'appIsReady', message: 'init' };
    this.broadcastService.broadcast(broadcastEvent);
  }
}


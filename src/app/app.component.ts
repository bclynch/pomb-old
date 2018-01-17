import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { APIService } from '../services/api.service';
import { LocalStorageService } from '../services/localStorage.service';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';
import { SettingsService } from '../services/settings.service';
import { BroadcastService, BroadcastEvent } from '../services/broadcast.service';

declare let ga: Function;

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor(
    private apiService: APIService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private alertService: AlertService,
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private router: Router
  ) {
    // grab site config
    this.settingsService.appInit().then(() => {
      this.settingsService.appInited = true;

      this.apiService.getCurrentAccount().subscribe(({ data }) => {
        // checking in to snag user data
        console.log('got user data', data);
        if (data.currentAccount) {
          this.userService.signedIn = true;
          this.userService.user = data.currentAccount;
          this.emitReady();
        } else {
          // if it doesnt exist dump the token
          this.localStorageService.set('pomb-user', '');
          this.emitReady();
        }
      }, (error) => {
        console.log('there was an error sending the query', error);
        this.localStorageService.set('pomb-user', '');
        alertService.alert('Internal Error', 'There was a problem with our servers, please be patient!');
        this.emitReady();
      });
    }, error => {
      // JWT expired so get rid of it in local storage
      this.localStorageService.set('pomb-user', '');
      window.location.reload();
    });
  }

  // analytics tracking
  ngOnInit() {
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  emitReady() {
    // app ready to init
    const broadcastEvent: BroadcastEvent = { name: 'appIsReady', message: 'init' };
    this.broadcastService.broadcast(broadcastEvent);
  }
}


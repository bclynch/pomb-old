import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { APIService } from '../services/api.service';

declare let ga: Function;

@Injectable()
export class AnalyticsService {

  subscription: Subscription;

  constructor(
    private router: Router,
    private apiService: APIService
  ) {

  }

  trackViews() {
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }

  getPageViews() {
    return new Promise((resolve, reject) => {
      this.apiService.getViews(this.router.url).subscribe(
        result => {
          resolve(result);
        },
        err => reject(err)
      );
    });
  }

  destroyTracking() {
    this.subscription.unsubscribe();
  }
}

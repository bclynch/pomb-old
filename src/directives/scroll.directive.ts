import { Directive, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UtilService } from '../services/util.service';
import { ExploreService } from '../services/explore.service';
import { TripService } from '../services/trip.service';
import { JunctureService } from '../services/juncture.service';

@Directive({ selector: '[scrollDirective]' })
export class WindowScrollDirective implements OnInit, OnDestroy {

    private eventOptions: boolean|{capture?: boolean, passive?: boolean};
    private priorScrollValue = window.pageYOffset || document.documentElement.scrollTop;
    scrollDirection: 'up' | 'down' = null;

    constructor(
      private ngZone: NgZone,
      private utilService: UtilService,
      private router: Router,
      private exploreService: ExploreService,
      private tripService: TripService,
      private junctureService: JunctureService
    ) {
      this.exploreService.displayExploreNav = this.priorScrollValue > 345;
      this.tripService.displayTripNav = this.priorScrollValue > 630;
      this.junctureService.displayTripNav = this.priorScrollValue > 160;
    }

    ngOnInit() {
      // check support for passive event listener
      let supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, 'passive', {
          get: function() {
            supportsPassive = true;
          }
        });
        window.addEventListener('test', null, opts);
      } catch (e) {}

      if (supportsPassive) {
          this.eventOptions = {
              capture: true,
              passive: true
          };
      } else {
          this.eventOptions = true;
      }

      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.scroll, <any>this.eventOptions);
      });
    }

    ngOnDestroy() {
      window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);
    }

    scroll = (e): void => {
      const scrollDirection: 'up' | 'down' = e.target.scrollTop > this.priorScrollValue ? 'down' : 'up';

      // if new direction is different from old run change detection && if past 40px (height of nav bar)
      if (this.scrollDirection !== scrollDirection && e.target.scrollTop > 40) {
        this.scrollDirection = scrollDirection;
        this.ngZone.run(() => {
          this.utilService.scrollDirection = scrollDirection;
        });
      }

      this.priorScrollValue = e.target.scrollTop;

      // if explore page run change detection when crossing 360 threshold sweetspot for our fixed side menu
      if (this.router.url.split('/')[1] === 'explore') {
        if (e.target.scrollTop > 345 && this.exploreService.displayExploreNav === false) {
          this.ngZone.run(() => {
            this.exploreService.displayExploreNav = true;
          });
        } else if (e.target.scrollTop < 345 && this.exploreService.displayExploreNav === true) {
          this.ngZone.run(() => {
            this.exploreService.displayExploreNav = false;
          });
        }
      }
      // if trip page run change detection when crossing 360 threshold sweetspot for our fixed nav menu
      if (this.router.url.split('/')[1] === 'trip') {
        if (e.target.scrollTop > 630 && this.tripService.displayTripNav === false) {
          this.ngZone.run(() => {
            this.tripService.displayTripNav = true;
          });
        } else if (e.target.scrollTop < 630 && this.tripService.displayTripNav === true) {
          this.ngZone.run(() => {
            this.tripService.displayTripNav = false;
          });
        }
      }
      // if trip timeline page run change detection when crossing 360 threshold sweetspot for our fixed nav menu
      if (this.router.url.split('/')[1] === 'trip' && this.router.url.split('/')[3] === 'junctures') {
        if (e.target.scrollTop > 160 && this.junctureService.displayTripNav === false) {
          this.ngZone.run(() => {
            this.junctureService.displayTripNav = true;
          });
        } else if (e.target.scrollTop < 160 && this.junctureService.displayTripNav === true) {
          this.ngZone.run(() => {
            this.junctureService.displayTripNav = false;
          });
        }
      }
      if (this.utilService.checkScrollInfinite && !this.utilService.allFetched) {
        // console.log(e);
        const heightFromBottom = e.target.scrollHeight - (e.target.scrollTop + e.target.offsetHeight);
        if (heightFromBottom < 150 && this.scrollDirection === 'down' && !this.utilService.infiniteActive) {
          this.utilService.toggleInfiniteActive(true);
        }
      }
    }
  }

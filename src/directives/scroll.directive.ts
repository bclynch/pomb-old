import { Directive, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { UtilService } from '../services/util.service'
import { ExploreService } from '../services/explore.service'

@Directive({ selector: '[scrollDirective]' })
export class WindowScrollDirective {
  
    private eventOptions: boolean|{capture?: boolean, passive?: boolean};
    private priorScrollValue = window.pageYOffset || document.documentElement.scrollTop;
    scrollDirection: 'up' | 'down' = null;

    constructor(
      private ngZone: NgZone,
      private utilService: UtilService,
      private router: Router,
      private exploreService: ExploreService
    ) {
      this.exploreService.displayExploreNav = this.priorScrollValue > 345;
    }

    ngOnInit() {    
      //check support for passive event listener
      let supportsPassive = false;
      try {
        var opts = Object.defineProperty({}, 'passive', {
          get: function() {
            supportsPassive = true;
          }
        });
        window.addEventListener("test", null, opts);
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
      let scrollDirection: 'up' | 'down' = e.target.scrollTop > this.priorScrollValue ? 'down' : 'up';
      
      //if new direction is different from old run change detection && if past 40px (height of nav bar)
      if(this.scrollDirection !== scrollDirection && e.target.scrollTop > 40) {
        this.scrollDirection = scrollDirection;
        this.ngZone.run(() => {
          this.utilService.scrollDirection = scrollDirection;
        });
      }

      this.priorScrollValue = e.target.scrollTop;

      //if explore page run change detection when crossing 360 threshold sweetspot for our fixed side menu
      if(this.router.url.split('/')[1] === 'explore') {
        if(e.target.scrollTop > 345 && this.exploreService.displayExploreNav === false) {
          this.ngZone.run(() => {
            this.exploreService.displayExploreNav = true;
          });
        } else if(e.target.scrollTop < 345 && this.exploreService.displayExploreNav === true) {
          this.ngZone.run(() => {
            this.exploreService.displayExploreNav = false;
          });
        }
      }
    };  
  }
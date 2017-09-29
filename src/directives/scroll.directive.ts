import { Directive, NgZone } from '@angular/core';

import { UtilService } from '../services/util.service'

@Directive({ selector: '[scrollDirective]' })
export class WindowScrollDirective {
  
    private eventOptions: boolean|{capture?: boolean, passive?: boolean};
    private priorScrollValue = window.pageYOffset || document.documentElement.scrollTop;
    scrollDirection: 'up' | 'down' = null;

    constructor(
      private ngZone: NgZone,
      private utilService: UtilService
    ) {}

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
      
      //if new direction is different from old run change detection
      if(this.scrollDirection !== scrollDirection) {
        this.scrollDirection = scrollDirection;
        this.ngZone.run(() => {
          this.utilService.scrollDirection = scrollDirection;
        });
      }

      this.priorScrollValue = e.target.scrollTop;
    };  
  }
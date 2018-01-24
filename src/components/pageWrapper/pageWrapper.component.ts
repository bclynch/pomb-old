import { Component, Input } from '@angular/core';

import { UtilService } from '../../services/util.service';

@Component({
  selector: 'PageWrapper',
  templateUrl: 'pageWrapper.component.html'
})
export class PageWrapper {
  @Input() backgroundColor = 'white';
  @Input() displayNavLogo = true;
  @Input() displayHeroBanner = false;
  @Input() displayFooter = true;
  @Input() displayNav = true;
  @Input() collapsibleNav = true;
  @Input() topo = false;

  constructor(
    private utilService: UtilService
  ) {
    // want nav always there on page init to start
    this.utilService.scrollDirection = 'up';
  }

}

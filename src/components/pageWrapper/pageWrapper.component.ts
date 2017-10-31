import { Component, Input } from '@angular/core';

import { UtilService } from '../../services/util.service';

@Component({
  selector: 'PageWrapper',
  templateUrl: 'pageWrapper.component.html'
})
export class PageWrapper {
  @Input() backgroundColor: string = 'white';
  @Input() displayNavLogo: boolean = true;
  @Input() displayHeroBanner: boolean = false;
  @Input() displayFooter: boolean = true;
  @Input() displayNav: boolean = true;
  @Input() collapsibleNav: boolean = true;

  constructor(
    private utilService: UtilService
  ) { 
    //want nav always there on page init to start
    this.utilService.scrollDirection = 'up';
  }

}

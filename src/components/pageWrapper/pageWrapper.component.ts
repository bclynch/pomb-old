import { Component, Input } from '@angular/core';

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

  searchIsActive: boolean = false;

  constructor(

  ) { }

}

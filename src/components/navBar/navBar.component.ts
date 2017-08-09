import { Component, Input } from '@angular/core';

@Component({
  selector: 'NavBar',
  templateUrl: 'navBar.component.html'
})
export class NavBar {
  @Input() displayLogo: boolean = true;

  constructor() { }

}

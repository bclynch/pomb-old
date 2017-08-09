import { Component, Input } from '@angular/core';

@Component({
  selector: 'HeroBanner',
  templateUrl: 'heroBanner.component.html'
})
export class HeroBanner {

  tagline: string = 'Be Your Best';
  today: number = Date.now();

  constructor() { }

}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'HeroBanner',
  templateUrl: 'heroBanner.component.html'
})
export class HeroBanner {

  tagline: string = 'Do The Dew';
  today: number = Date.now();

  constructor() { }

}

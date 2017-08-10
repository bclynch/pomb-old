import { Component, Input } from '@angular/core';

@Component({
  selector: 'GridCard',
  templateUrl: 'gridCard.component.html'
})
export class GridCard {
  @Input() data;

  constructor() { 

  }

}

import { Component } from '@angular/core';

@Component({
  selector: 'Grid',
  templateUrl: 'grid.component.html'
})
export class Grid {

  gridConfiguration: number[][] = [ [ 3, 1.5 ], [ 1.5, 3 ], [ 3, 3, 3 ] ];

  constructor() { }

}

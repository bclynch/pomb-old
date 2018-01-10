import { Component, Input } from '@angular/core';

@Component({
  selector: 'BackpackIcon',
  templateUrl: 'backpack.component.html'
})
export class BackpackIcon {
  @Input() color = 'black';

  constructor() { }

}

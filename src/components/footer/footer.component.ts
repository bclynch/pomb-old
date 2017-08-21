import { Component } from '@angular/core';

@Component({
  selector: 'Footer',
  templateUrl: 'footer.component.html'
})
export class Footer {
  year = Date.now();

  constructor() { }

}

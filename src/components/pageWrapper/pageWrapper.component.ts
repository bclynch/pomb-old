import { Component, Input } from '@angular/core';

@Component({
  selector: 'PageWrapper',
  templateUrl: 'pageWrapper.component.html'
})
export class PageWrapper {
  @Input() backgroundColor: string = 'white';

  constructor(

  ) { }

}

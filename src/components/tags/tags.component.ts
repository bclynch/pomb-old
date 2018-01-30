import { Component, Input } from '@angular/core';

import { RouterService } from '../../services/router.service';


@Component({
  selector: 'Tags',
  templateUrl: 'tags.component.html'
})
export class Tags {
  @Input() tags: string[];

  constructor(
    private routerService: RouterService
  ) {

  }


}

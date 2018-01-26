import { Component } from '@angular/core';

import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'page-general-error',
  templateUrl: 'general.html',
})
export class GeneralErrorPage {

  constructor(
    private errorService: ErrorService,
  ) { }

}

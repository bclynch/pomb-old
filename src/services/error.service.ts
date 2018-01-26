import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

@Injectable()
export class ErrorService {

  errorStatus: string;
  errorStatusText: string;

  constructor(
    private router: Router,
  ) { }

  handleResponseError(res) {
    this.errorStatus = res.status;
    this.errorStatusText = res.statusText ? res.statusText : res.message;

    this.router.navigate(['error']);
  }
}

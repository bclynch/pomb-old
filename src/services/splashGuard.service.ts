import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LocalStorageService } from './localStorage.service';

@Injectable()
export class SplashGuardService implements CanActivate {

  constructor(
    public router: Router,
    private localStorageService: LocalStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    // for now this is better than the user service method because it isn't async and waiting for server
    // its possible the token could be expired, but this is a solid bet
    const user = this.localStorageService.get('pomb-user');
    if (user && user.token) this.router.navigate(['/stories']);
    return true;
  }
}

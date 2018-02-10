import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import decode from 'jwt-decode';

import { LocalStorageService } from './localStorage.service';

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(
    public router: Router,
    private localStorageService: LocalStorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    if (this.localStorageService.get('pomb-user')) {
      const token = this.localStorageService.get('pomb-user').token;
      // decode the token to get its payload
      const tokenPayload = decode(token);
      console.log(tokenPayload);
      if (!tokenPayload) return false;

      if (tokenPayload.role !== expectedRole) {
        this.router.navigate(['']);
        return false;
      }
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}

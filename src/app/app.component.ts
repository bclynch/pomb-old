import { Component } from '@angular/core';

import { APIService } from '../services/api.service';
import { LocalStorageService } from '../services/localStorage.service';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  constructor(
    private apiService: APIService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.apiService.getCurrentAccount().subscribe(({ data }) => { 
      //checking in to snag user data
      console.log('got data', data); 
      if(data.currentAccount) {
        this.userService.signedIn = true;
        this.userService.user = data.currentAccount;
      } else {
        // if it doesnt exist dump the token
        this.localStorageService.set('pomb-user', '');
      }
    },(error) => {
      console.log('there was an error sending the query', error);
      this.localStorageService.set('pomb-user', '');
      alertService.alert('Internal Error', 'There was a problem with our servers, please be patient!');
    });
  }
}


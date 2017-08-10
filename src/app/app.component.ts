import { Component } from '@angular/core';

import { APIService } from '../services/api.service';
import { LocalStorageService } from '../services/localStorage.service';
import { UserService } from '../services/user.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  constructor(
    private apiService: APIService,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {
    this.apiService.getCurrentPerson().subscribe(({ data }) => { 
      //checking in to snag user data
      console.log('got data', data); 
      if(data.currentUser) {
        this.userService.signedIn = true;
        this.userService.user = data.currentUser;
      } else {
        // if it doesnt exist dump the token
        this.localStorageService.set('pomb-user', '');
      }
    },(error) => {
      console.log('there was an error sending the query', error);
      this.localStorageService.set('pomb-user', '');
      alert('There was a problem logging in your account, please do so again.');
    });
  }
}


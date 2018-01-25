import { Injectable } from '@angular/core';
import {Apollo} from 'apollo-angular';

import { APIService } from './api.service';
import { LocalStorageService } from './localStorage.service';
import { AlertService } from './alert.service';

import { Registration } from '../models/Registration.model';
import { Login } from '../models/Login.model';
import { User } from '../models/User.model';

@Injectable()
export class UserService {
  signedIn = false;
  user: User;

  // for use in our nav panel
  recentTrip;
  recentJunctures;
  recentPosts;

  constructor(
    private apiService: APIService,
    private apollo: Apollo,
    private localStorageService: LocalStorageService,
    private alertService: AlertService
  ) { }

  init() {
    return new Promise<string>((resolve, reject) => {
      this.apiService.getRecentUserActivity(this.user.username).valueChanges.subscribe(
        result => {
          console.log(result);
          this.recentTrip = result.data.accountByUsername.tripsByUserId.nodes[0];
          this.recentJunctures = result.data.accountByUsername.juncturesByUserId.nodes;
          this.recentPosts = result.data.accountByUsername.postsByAuthor.nodes;
          resolve();
        }, err => reject()
      );
    });
  }

  loginUser(model) {
    this.authAccount({email: model.email, password: model.password}).then((token) => {
      // need to get current user function rolling for other pertinent info
      const userObj: any = {};
      userObj.token = token;

      // save user to local storage
      this.localStorageService.set('pomb-user', userObj);
      console.log(this.localStorageService.get('pomb-user'));

      // reload window to update db role
      window.location.reload();
    }, (err) => {
      this.alertService.alert('Invalid Login', 'The email or password is incorrect. Please check your account information and login again');
    });
  }

  logoutUser() {
    this.signedIn = false;
    // reset apollo cache and refetch queries
    this.apollo.getClient().resetStore();
    localStorage.removeItem('pomb-user');
    // reload window to update db role
    window.location.reload();
  }

  private authAccount(loginCredentials: Login): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.apiService.authAccount(loginCredentials.email, loginCredentials.password).subscribe(({ data }) => {
        console.log('got data', data);
        const authData = <any>data;
        if (authData.authenticateAccount.jwtToken) {
          this.signedIn = true;
          // reset apollo cache and refetch queries
          this.apollo.getClient().resetStore();
          resolve(authData.authenticateAccount.jwtToken);
        } else {
          // incorrect login warning
          reject('invalid login');
        }
      }, (error) => {
        console.log('there was an error sending the query', error);
        reject(error);
      });
    });
  }

  registerAccount(model: Registration) {
    this.apiService.registerAccount(model.username, model.firstName, model.lastName, model.password, model.email).subscribe(({ data }) => {
      const userObj = data as any;
      console.log('Successfully created account');

      // auth to snag token
      this.authAccount({email: model.email, password: model.password}).then((token) => {
        userObj.token = token;
        // save user token to local storage
        this.localStorageService.set('pomb-user', userObj);

        // reload window to update db role
        window.location.reload();
      }, () => {
        console.log('err');
      });
    }, err => {
      switch (err.message) {
        case 'GraphQL error: duplicate key value violates unique constraint "account_username_key"':
          this.alertService.alert('Invalid Registration', 'That username already exists, please select a new one!');
          break;
        default:
        this.alertService.alert('Invalid Registration', 'Something is fucked in your credentials. Try again');
      }
    });
  }
}

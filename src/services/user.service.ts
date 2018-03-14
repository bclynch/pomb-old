import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';

import { APIService } from './api.service';
import { LocalStorageService } from './localStorage.service';
import { AlertService } from './alert.service';

import { Registration } from '../models/Registration.model';
import { Login } from '../models/Login.model';
import { User } from '../models/User.model';
import { Trip } from '../models/Trip.model';
import { Juncture } from '../models/Juncture.model';
import { Post } from '../models/Post.model';

@Injectable()
export class UserService {
  signedIn = false;
  user: User = null;

  // for use in our nav panel
  recentTrip: Trip;
  recentJunctures: Juncture[];
  recentPosts: Post[];

  constructor(
    private apiService: APIService,
    private apollo: Apollo,
    private localStorageService: LocalStorageService,
    private alertService: AlertService,
    private router: Router
  ) { }

  init() {
    return new Promise<string>((resolve, reject) => {
      this.apiService.getRecentUserActivity(this.user.username).valueChanges.subscribe(
        result => {
          this.recentTrip = result.data.accountByUsername.tripsByUserId.nodes[0];
          this.recentJunctures = result.data.accountByUsername.juncturesByUserId.nodes;
          this.recentPosts = result.data.accountByUsername.postsByAuthor.nodes;
          resolve();
        }, err => reject()
      );
    });
  }

  loginUser(model) {
    this.authUserAccount({ email: model.email, password: model.password }).then((token) => {
      // need to get current user function rolling for other pertinent info
      const userObj: any = {};
      userObj.token = token;

      // save user to local storage
      this.localStorageService.set('pomb-user', userObj);

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
    // this.router.navigateByUrl('/');
    // reload window to update db role
    window.location.reload();
  }

  loginAdminUser(model) {
    this.authAdminAccount({ email: model.email, password: model.password }).then((token) => {
      // need to get current user function rolling for other pertinent info
      const userObj: any = {};
      userObj.token = token;

      // save user to local storage
      this.localStorageService.set('pomb-user', userObj);

      this.router.navigateByUrl('/admin');
      // reload window to update db role
      window.location.reload();
    }, (err) => {
      this.alertService.alert('Invalid Login', 'The email or password is incorrect. Please check your account information and login again');
    });
  }

  private authUserAccount(loginCredentials: Login): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.apiService.authUserAccount(loginCredentials.email, loginCredentials.password).subscribe(({ data }) => {
        // console.log('got data', data);
        const authData = <any>data;
        if (authData.authenticateUserAccount.jwtToken) {
          this.signedIn = true;
          // reset apollo cache and refetch queries
          this.apollo.getClient().resetStore();
          resolve(authData.authenticateUserAccount.jwtToken);
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

  registerUserAccount(model: Registration) {
    this.apiService.registerUserAccount(model.username, model.firstName, model.lastName, model.password, model.email).subscribe(({ data }) => {
      const userObj = data as any;

      // send welcome registration email
      this.apiService.sendRegistrationEmail(model.email).subscribe(
        result => {}
      );

      // auth to snag token
      this.authUserAccount({ email: model.email, password: model.password }).then((token) => {
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
        case 'GraphQL error: duplicate key value violates unique constraint "user_account_email_key"':
          this.alertService.alert('Invalid Registration', 'The selected email already exists. Try resetting your password or use a new email address.');
          break;
        case 'GraphQL error: permission denied for function register_account':
          this.alertService.alert('Submission Error', 'Looks like you\'re still logged into another account. Make sure you\'re logged out or reload the page and try again');
          break;
        default:
          this.alertService.alert('Invalid Registration', 'There is an issue submitting your registration. Please reload and try again');
      }
    });
  }

  private authAdminAccount(loginCredentials: Login): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.apiService.authAdminAccount(loginCredentials.email, loginCredentials.password).subscribe(({ data }) => {
        const authData = <any>data;
        if (authData.authenticateAdminAccount.jwtToken) {
          this.signedIn = true;
          // reset apollo cache and refetch queries
          this.apollo.getClient().resetStore();
          resolve(authData.authenticateAdminAccount.jwtToken);
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
}

import { Component } from '@angular/core';

import { APIService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'page-reset',
  templateUrl: 'reset.html'
})
export class ResetPage {

  resetModel = { email: '' };

  constructor(
    private apiService: APIService,
    private alertService: AlertService
  ) {  }

  sendReset(model) {
    this.apiService.resetPassword(model.email).subscribe(
      result => {
        this.apiService.sendResetEmail(model.email, result.data.resetPassword.string).subscribe(
          data => {
            console.log(data);
            if (data.result === 'Forgot email sent') this.alertService.alert('Email Sent', 'Your password reset email has been sent. Please check your inbox for the new password. It might take a minute or two to send.');
          }
        );
      },
      err => {
        switch (err.message) {
          case 'GraphQL error: permission denied for function reset_password':
            this.alertService.alert('Error', 'Cannot reset password while user is logged in');
            break;
          case 'GraphQL error: column "user does not exist" does not exist':
            this.alertService.alert('Error', 'That email doesn\t exist. Check what you entered and try again');
            break;
          default:
            this.alertService.alert('Error', 'Something went wrong. Check your email address and try again');
        }
      }
    );
  }
}

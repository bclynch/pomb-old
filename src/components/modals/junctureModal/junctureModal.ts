import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewController, NavParams } from 'ionic-angular';

import { APIService } from '../../../services/api.service';
import { UserService } from '../../../services/user.service';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'JunctureModal',
  templateUrl: 'junctureModal.html'
})
export class JunctureModal {
  registrationModel = {username: '', firstName: '', lastName: '', email: '', password: '', confirm: ''};
  loginModel = {email: '', password: ''};

  formModel = { time: null } 

  timeOptions = [
    { label: 'Use Current Time', value: 'current' },
    { label: 'Use Custom Time', value: 'custom' }
  ]

  constructor(
    public viewCtrl: ViewController,
    private apiService: APIService,
    private userService: UserService,
    private params: NavParams,
    private router: Router,
    private settingsService: SettingsService
  ) {

  }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  submit() {
    console.log(this.formModel);
  }
}

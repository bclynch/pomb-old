import { Component } from '@angular/core';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-admin-login',
  templateUrl: 'adminLogin.html'
})
export class AdminLoginPage {

  loginModel = { email: null, password: null };

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private userService: UserService
  ) {
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {

  }
}

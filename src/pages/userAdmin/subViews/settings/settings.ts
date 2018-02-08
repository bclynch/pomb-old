import { Component } from '@angular/core';

import { SettingsService } from '../../../../services/settings.service';
import { RouterService } from '../../../../services/router.service';

@Component({
  selector: 'page-useradmin-settings',
  templateUrl: 'settings.html'
})
export class UserAdminSettingsPage {

  changeModel = {currentPassword: '', newPassword: '', confirmPassword: ''};

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService
  ) {  }

  changePassword(model) {
    console.log(model);
  }
}

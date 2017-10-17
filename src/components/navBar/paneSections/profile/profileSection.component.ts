import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { RegistrationModal } from '../../../modals/registrationModal/registrationModal';

import { SettingsService } from '../../../../services/settings.service';
import { RouterService } from '../../../../services/router.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'ProfileNavSection',
  templateUrl: 'profileSection.component.html'
})
export class ProfileNavSection {

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private userService: UserService,
    private modalCtrl: ModalController
  ) {}

  navigate(path: string) {
    switch(path) {
      case 'blog':
        this.routerService.navigateToPage(`/post-dashboard/${this.userService.user.username}`);
        break;
      default:
      this.routerService.navigateToPage(`/${path}`);
    }
  }

  logout() {
    this.userService.logoutUser();
  }

  signinUser() {
    let modal = this.modalCtrl.create(RegistrationModal, {}, {cssClass: 'registrationModal'});
    modal.present(); 
  }
}

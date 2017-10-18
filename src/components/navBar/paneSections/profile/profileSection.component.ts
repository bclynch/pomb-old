import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { RegistrationModal } from '../../../modals/registrationModal/registrationModal';

import { SettingsService } from '../../../../services/settings.service';
import { RouterService } from '../../../../services/router.service';
import { UserService } from '../../../../services/user.service';
import { JunctureService } from '../../../../services/juncture.service';

@Component({
  selector: 'ProfileNavSection',
  templateUrl: 'profileSection.component.html'
})
export class ProfileNavSection {

  quickLinks = [
    {label: 'Juncture Check In', value: 'checkIn'},
    {label: 'Blog Dashboard', value: 'blog'},
    {label: 'Feed', value: 'feed'}
  ];

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private junctureService: JunctureService
  ) {}

  navigate(path: string) {
    switch(path) {
      case 'blog':
        this.routerService.navigateToPage(`/${this.userService.user.username}/post-dashboard`);
        break;
      case 'userAdmin':
        this.routerService.navigateToPage(`/${this.userService.user.username}/admin`);
        break;
      case 'checkIn':
        this.junctureService.createJuncture();
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

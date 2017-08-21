import { Component, Input } from '@angular/core';
import { PopoverController, ModalController } from 'ionic-angular';

import { ProfilePopover } from '../popovers/profile/profilePopover.component';
import { RegistrationModal } from '../modals/registrationModal/registrationModal';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';
import { UserService } from '../../services/user.service';

interface Social {
  icon: string;
  url: string;
}

interface Section {
  label: string;
  value: string;
}

@Component({
  selector: 'NavBar',
  templateUrl: 'navBar.component.html'
})
export class NavBar {
  @Input() displayLogo: boolean = true;

  socialOptions: Social[] = [
    { icon: 'logo-instagram', url: 'https://www.instagram.com/bclynch7/' },
    { icon: 'logo-facebook', url: 'https://www.facebook.com/brendan.lynch.90' },
    { icon: 'logo-github', url: 'https://github.com/bclynch' },
  ];

  sectionOptions: Section[] = [
    {label: 'Trekking', value: 'trekking'}, 
    {label: 'Biking', value: 'biking'}, 
    {label: 'Culture', value: 'culture'}, 
    {label: 'Food', value: 'food'},
    {label: 'Gear', value: 'gear'},];

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private popoverCtrl: PopoverController,
    private userService: UserService,
    private modalCtrl: ModalController
  ) { }

  navigate(path: string) {
    this.routerService.navigateToPage(`/${path}`);
  }

  presentPopover(e) { 
    let popover = this.popoverCtrl.create(
      ProfilePopover,
      {},
      { cssClass: 'profilePopover' }
    );
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      switch(data) {
        case 'login':
          this.signinUser()
          break;
        case 'logout':
          this.userService.logoutUser();
          break;
        case 'postDashboard':
        this.routerService.navigateToPage(`/post-dashboard/${this.userService.user.username}`);
          break;
        default:
          if(data) this.navigate(data);
      }
    });
  }

  signinUser() {
    let modal = this.modalCtrl.create(RegistrationModal, {}, {cssClass: 'registrationModal'});
    modal.present(); 
  }
}

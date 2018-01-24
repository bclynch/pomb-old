import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { RegistrationModal } from '../modals/registrationModal/registrationModal';
import { MobileNavModal } from '../modals/mobileNavModal/mobileNavModal';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';
import { UserService } from '../../services/user.service';
import { BroadcastService } from '../../services/broadcast.service';
import { ExploreService } from '../../services/explore.service';
import { UtilService } from '../../services/util.service';

interface Social {
  icon: string;
  url: string;
  label: string;
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
  @Input() collapsibleNav: boolean;

  socialOptions: Social[] = [
    { icon: 'logo-instagram', url: 'https://www.instagram.com/bclynch7/', label: 'instagram' },
    { icon: 'logo-facebook', url: 'https://www.facebook.com/brendan.lynch.90', label: 'facebook' },
    { icon: 'logo-github', url: 'https://github.com/bclynch', label: 'github' },
  ];

  sectionOptions: Section[] = [];
  isExpanded = false; // set to true for testing
  activeSection: Section;

  searchActive = false;

  regions;

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private broadcastService: BroadcastService,
    private exploreService: ExploreService,
    private utilService: UtilService,
    private sanitizer: DomSanitizer
  ) {
    this.settingsService.appInited ? this.snagCategories() : this.broadcastService.on('appIsReady', () => this.snagCategories());
  }

  snagCategories() {
    Object.keys(this.settingsService.siteSections).forEach((category) => {
      this.sectionOptions.push({ label: category, value: category.toLowerCase() });
    });
    // this.activeSection = this.sectionOptions[1];
  }

  navigate(path: string) {
    path === 'my pack' ? this.routerService.navigateToPage(`/${this.userService.user.username}`) : this.routerService.navigateToPage(`/${path}`);
  }

  signinUser() {
    const modal = this.modalCtrl.create(RegistrationModal, {}, {cssClass: 'registrationModal'});
    modal.present();
  }

  openSearch() {
    this.searchActive = !this.searchActive;
    this.isExpanded = false;
  }

  navHover(e, i: number) {
    if (e.type === 'mouseenter') {
      this.isExpanded = true;
      this.activeSection = this.sectionOptions[i];
    } else {
      this.isExpanded = false;
      this.activeSection = null;
    }
  }

  openMobileNav() {
    const modal = this.modalCtrl.create(MobileNavModal, {}, {cssClass: 'mobileNavModal', enableBackdropDismiss: false});
    modal.onDidDismiss(data => {
      if (data) {
        if (data === 'home') {
          this.routerService.navigateToPage('/');
        } else {
          this.routerService.navigateToPage(`/${data}`);
        }
      }
    });
    modal.present();
  }
}

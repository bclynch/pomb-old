import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController, ModalController } from 'ionic-angular';

import { ProfilePopover } from '../popovers/profile/profilePopover.component';
import { RegistrationModal } from '../modals/registrationModal/registrationModal';

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
  @Input() displayLogo: boolean = true;
  // @Output() searchTrigger: EventEmitter<void> = new EventEmitter<void>();

  socialOptions: Social[] = [
    { icon: 'logo-instagram', url: 'https://www.instagram.com/bclynch7/', label: 'instagram' },
    { icon: 'logo-facebook', url: 'https://www.facebook.com/brendan.lynch.90', label: 'facebook' },
    { icon: 'logo-github', url: 'https://github.com/bclynch', label: 'github' },
  ];

  sectionOptions: Section[] = [];
  isExpanded: boolean = false;
  activeSection: Section;

  searchActive: boolean = false;

  regions;

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private popoverCtrl: PopoverController,
    private userService: UserService,
    private modalCtrl: ModalController,
    private broadcastService: BroadcastService,
    private exploreService: ExploreService,
    private utilService: UtilService
  ) {
    this.settingsService.appInited ? this.snagCategories() : this.broadcastService.on('appIsReady', () => this.snagCategories()); 
  }

  snagCategories() {
    Object.keys(this.settingsService.appCategories).forEach((category) => {
      this.sectionOptions.push({ label: category, value: category.toLowerCase() });
    });
    //add extra option
    this.sectionOptions.push({ label: 'Explore', value: 'explore' });
    this.sectionOptions.push({ label: 'Community', value: 'community' });
  }

  navigate(path: string) {
    this.routerService.navigateToPage(`/${path}`);
  }

  presentPopover(e) { 
    let popover = this.popoverCtrl.create(ProfilePopover, {}, { cssClass: 'profilePopover' });
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

  openSearch() {
    this.searchActive = !this.searchActive;
    this.isExpanded = false;
  }

  navHover(e, i: number) {
    if(e.type === 'mouseenter') {
      this.isExpanded = true;
      this.activeSection = this.sectionOptions[i];
    } else {
      this.isExpanded = false;
      this.activeSection = null;
    }
  }

  navigateToRegion(region: string) {
    this.routerService.navigateToPage(`/explore/region/${region.split(' ').join('-').toLowerCase()}`);
  }
}

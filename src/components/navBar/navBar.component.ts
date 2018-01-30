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
import { AlertService } from '../../services/alert.service';
import { TripService } from '../../services/trip.service';
import { JunctureService } from '../../services/juncture.service';

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
    private sanitizer: DomSanitizer,
    private alertService: AlertService,
    private tripService: TripService,
    private junctureService: JunctureService
  ) {
    this.settingsService.appInited ? this.snagCategories() : this.broadcastService.on('appIsReady', () => this.snagCategories());
  }

  snagCategories() {
    this.sectionOptions = [];
    Object.keys(this.settingsService.siteSections).forEach((category) => {
      this.sectionOptions.push({ label: category, value: category.toLowerCase() });
    });
    // this.activeSection = this.sectionOptions[2];
  }

  navigate(path: string) {
    if (path === 'my pack') {
      if (this.userService.user) {
        this.routerService.navigateToPage(`/user/${this.userService.user.username}`);
      } else {
        this.alertService.alert('Notification', 'Must login or create an account before vising your profile page');
      }
    } else {
      this.routerService.navigateToPage(`/${path}`);
    }
  }

  signinUser() {
    const modal = this.modalCtrl.create(RegistrationModal, {}, {cssClass: 'registrationModal'});
    modal.present();
  }

  openSearch() {
    this.searchActive = !this.searchActive;
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
        switch (data.toLowerCase()) {
          case 'community hub':
            this.routerService.navigateToPage('/community');
            break;
          case 'featured trip':
            this.routerService.navigateToPage(`/trip/${this.settingsService.featuredTrip.id}`);
            break;
          case 'stories hub':
            this.routerService.navigateToPage('/stories');
            break;
          case 'profile':
            this.routerService.navigateToPage(`/user/${this.userService.user.username}`);
            break;
          case 'create trip':
            this.tripService.createTrip();
            break;
          case 'create juncture':
            this.junctureService.createJuncture();
            break;
          case 'blog dashboard':
            this.routerService.navigateToPage(`/user/${this.userService.user.username}/post-dashboard`);
            break;
          case 'user dashboard':
            this.routerService.navigateToPage(`/user/${this.userService.user.username}/admin`);
            break;
          case 'logout':
            this.userService.logoutUser();
            break;
          default:
            this.routerService.navigateToPage(`/stories/${data}`);
            break;
        }
      }
    });
    modal.present();
  }
}

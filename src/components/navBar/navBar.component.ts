import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController, ModalController } from 'ionic-angular';

import { ProfilePopover } from '../popovers/profile/profilePopover.component';
import { RegistrationModal } from '../modals/registrationModal/registrationModal';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';
import { UserService } from '../../services/user.service';
import { BroadcastService } from '../../services/broadcast.service';

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
  @Output() searchTrigger: EventEmitter<void> = new EventEmitter<void>();

  socialOptions: Social[] = [
    { icon: 'logo-instagram', url: 'https://www.instagram.com/bclynch7/' },
    { icon: 'logo-facebook', url: 'https://www.facebook.com/brendan.lynch.90' },
    { icon: 'logo-github', url: 'https://github.com/bclynch' },
  ];

  sectionOptions: Section[] = [];
  isExpanded: boolean = false;
  activeSection: Section;

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private popoverCtrl: PopoverController,
    private userService: UserService,
    private modalCtrl: ModalController,
    private broadcastService: BroadcastService
  ) {
    this.settingsService.appInited ? this.snagCategories() : this.broadcastService.on('appIsReady', () => this.snagCategories()); 
  }

  snagCategories() {
    Object.keys(this.settingsService.appCategories).forEach((category) => {
      this.sectionOptions.push({ label: category, value: category.toLowerCase() });
    });
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
    this.searchTrigger.emit();
  }

  sectionHover(e, i: number) {
    console.log(e);
    if(e.type === 'mouseover') {
      this.isExpanded = true;
      this.activeSection = this.sectionOptions[i];
      return;
    }
    if(e.type === 'mouseout') {
      if(!e.relatedTarget) {
        this.isExpanded = false;
        this.activeSection = null;
        return;
      }
      if(e.relatedTarget.classList.contains('sectionInfoPane') || e.relatedTarget.classList.contains('boldFont')) return;
      this.isExpanded = false;
      this.activeSection = null;
    }
    console.log(this.isExpanded);
  }
  paneLeave() {
    this.isExpanded = false;
    this.activeSection = null;
  }
}

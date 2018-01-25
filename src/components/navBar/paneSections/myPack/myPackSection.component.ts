import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { RegistrationModal } from '../../../modals/registrationModal/registrationModal';

import { SettingsService } from '../../../../services/settings.service';
import { RouterService } from '../../../../services/router.service';
import { UserService } from '../../../../services/user.service';
import { JunctureService } from '../../../../services/juncture.service';
import { TripService } from '../../../../services/trip.service';

@Component({
  selector: 'MyPackNavSection',
  templateUrl: 'myPackSection.component.html'
})
export class MyPackNavSection {

  quickLinks = [
    { label: 'Create Trip', value: 'trip', icon: 'md-plane' },
    { label: 'Juncture Check-In', value: 'checkIn', icon: 'md-git-merge' },
    { label: 'Blog Dashboard', value: 'blog', icon: 'md-filing' },
    { label: 'User Dashboard', value: 'settings', icon: 'md-settings' }
  ];

  benefits = [
    { icon: 'md-locate', description: 'Chart and monitor your journey with our gps plotting and visualization tools. Make your trip come alive with in depth statistics and beautiful visuals to show off to your friends and look back on in the future.' },
    { icon: 'md-create', description: 'Carve your own path and manage your memories with our blog management system software. Customize the look and feel of your entries and how you share your own story with the rest of the world.' },
    { icon: 'md-globe', description: 'Join our community of travel and outdoor enthusiasts to gain valuable insight and knowledge on potential outings and excursions around the globe. Learn what it takes to make your dreams come alive and inspire others along the way.' },
    { icon: 'md-compass', description: 'Take the stress out of keeping friends and family in the loop. Pack On My Back makes it easy to stay connected with its family of tools to track and share life\'s best moments.' },
  ];

  user;

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private junctureService: JunctureService,
    private tripService: TripService,
    private sanitizer: DomSanitizer,
  ) {  }

  navigate(path: string) {
    switch (path) {
      case 'blog':
        this.routerService.navigateToPage(`/${this.userService.user.username}/post-dashboard`);
        break;
      case 'settings':
        this.routerService.navigateToPage(`/${this.userService.user.username}/admin`);
        break;
      case 'checkIn':
        this.junctureService.createJuncture();
        break;
      case 'trip':
        this.tripService.createTrip();
        break;
      default:
      this.routerService.navigateToPage(`/${path}`);
    }
  }

  logout() {
    this.userService.logoutUser();
  }

  signinUser() {
    const modal = this.modalCtrl.create(RegistrationModal, {}, {cssClass: 'registrationModal'});
    modal.present();
  }
}

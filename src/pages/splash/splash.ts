import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';

import { RegistrationModal } from '../../components/modals/registrationModal/registrationModal';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})
export class SplashPage {

  features = [
    { icon: 'md-map', title: 'Chart Your Journey Faster', description: 'Monitor your travels with our gps plotting and visualization tools. Make your trip come alive with in depth statistics and beautiful visuals to show off to your friends and look back on in the future.' },
    { icon: 'md-albums', title: 'Get Creative', description: 'Carve your own path and manage your memories with our blog management system software. Customize the look and feel of your entries and how you share your own story with the rest of the world.' },
    { icon: 'md-compass', title: 'Stay Connected', description: 'Take the stress out of keeping friends and family in the loop. Pack On My Back makes it easy to stay connected with its family of tools to track and share life\'s best moments.' }
  ];

  registrationModel = { username: '', firstName: '', lastName: '', email: '', password: '' };

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private router: Router,
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
  ) {
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    // console.log(this.userService.signedIn);
    // if (this.userService.signedIn) {
    //   console.log('authenticated');
    //   this.router.navigateByUrl('/stories');
    // }
    this.settingsService.modPageMeta('Travel Tracking, Blogging, and Sharing Made Easy', 'Log and share your memories with Pack On My Back. Sophisticated, yet easy to use tools make plotting your journey, writing a blog, and visualizing your trip easy. Make your experiences last a lifetime.');
  }

  registerUser() {
    const modal = this.modalCtrl.create(RegistrationModal, { isRegister: true }, {cssClass: 'registrationModal'});
    modal.present();
  }
}

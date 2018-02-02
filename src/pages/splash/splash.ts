import { Component } from '@angular/core';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})
export class SplashPage {

  features = [
    { icon: 'md-map', title: 'Chart Your Journey Faster', description: 'Monitor your travels with our gps plotting and visualization tools. Make your trip come alive with in depth statistics and beautiful visuals to show off to your friends and look back on in the future.', callout: 'Learn more about our visualization software' },
    { icon: 'md-albums', title: 'Get Creative', description: 'Carve your own path and manage your memories with our blog management system software. Customize the look and feel of your entries and how you share your own story with the rest of the world.', callout: 'Learn more about our blogging platform' },
    { icon: 'md-compass', title: 'Stay Connected', description: 'Take the stress out of keeping friends and family in the loop. Pack On My Back makes it easy to stay connected with its family of tools to track and share life\'s best moments.', callout: 'Learn more about our social features' }
  ];

  registrationModel = { username: '', firstName: '', lastName: '', email: '', password: '' };

  constructor(
    private userService: UserService
  ) {  }

}

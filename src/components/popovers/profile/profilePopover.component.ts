import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { UserService } from '../../../services/user.service';

interface NavOptions {
  label: string; 
  value: string; 
  icon: string;
};

@Component({
  selector: 'ProfilePopover',
  templateUrl: 'profilePopover.component.html'
})
export class ProfilePopover {

  navOptions: NavOptions[];

  constructor(
    public viewCtrl: ViewController,
    private userService: UserService
  ) {

    this.navOptions = [
      {label: 'Profile', value: 'profile', icon: 'md-person'},
      {label: 'Favorites', value: 'favorites', icon: 'md-star'},
      {label: 'Settings', value: 'settings', icon: 'md-cog'},
      {label: 'Logout', value: 'logout', icon: 'md-log-out'},
    ];
  }

  selectOption(option: string) {
    this.viewCtrl.dismiss(option);
  }
}
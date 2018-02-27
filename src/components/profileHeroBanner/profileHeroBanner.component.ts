import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { UserService } from '../../services/user.service';
import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'ProfileHeroBanner',
  templateUrl: 'profileHeroBanner.component.html'
})
export class ProfileHeroBanner {
  @Input() user;

  defaultBannerImg = 'https://www.yosemitehikes.com/images/wallpaper/yosemitehikes.com-bridalveil-winter-1200x800.jpg';

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private settingsService: SettingsService,
    private routerService: RouterService
  ) { }

  navigateToSettings() {
    this.routerService.modifyFragment('config', 'user/admin');
  }
}

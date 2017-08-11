import { Component, Input } from '@angular/core';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';

interface social {
  icon: string;
  url: string;
}

@Component({
  selector: 'NavBar',
  templateUrl: 'navBar.component.html'
})
export class NavBar {
  @Input() displayLogo: boolean = true;

  socialOptions: social[] = [
    { icon: 'logo-instagram', url: 'https://www.instagram.com/bclynch7/' },
    { icon: 'logo-facebook', url: 'https://www.facebook.com/brendan.lynch.90' },
    { icon: 'logo-github', url: 'https://github.com/bclynch' },
  ];

  sectionOptions: string[] = ['Trekking', 'Biking', 'Culture', 'Food', 'Gear'];

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService
  ) { }

}

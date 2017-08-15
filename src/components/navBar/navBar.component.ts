import { Component, Input } from '@angular/core';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';

interface social {
  icon: string;
  url: string;
}

interface section {
  label: string;
  value: string;
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

  sectionOptions: section[] = [
    {label: 'Trekking', value: 'trekking'}, 
    {label: 'Biking', value: 'biking'}, 
    {label: 'Culture', value: 'culture'}, 
    {label: 'Food', value: 'food'},
    {label: 'Gear', value: 'gear'},];

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService
  ) { }

  navigate(path: string) {
    this.routerService.navigateToPage(`/${path}`);
  }

}

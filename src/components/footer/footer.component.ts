import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'Footer',
  templateUrl: 'footer.component.html'
})
export class Footer {
  year = Date.now();

  links: string[] = ['About', 'Contact', 'Terms of Service'];
  socialOptions = [
    { icon: 'logo-instagram', url: 'https://www.instagram.com/bclynch7/', label: 'instagram' },
    { icon: 'logo-facebook', url: 'https://www.facebook.com/brendan.lynch.90', label: 'facebook' },
    { icon: 'logo-github', url: 'https://github.com/bclynch', label: 'github' },
  ];

  constructor(
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  navigateTo(link) {
    switch (link) {
      case 'About':
        this.router.navigateByUrl('/about');
        break;
      case 'Contact':
        this.router.navigateByUrl('/contact');
        break;
      case 'Terms of Service':
        this.router.navigateByUrl('/terms');
        break;
    }
  }
}

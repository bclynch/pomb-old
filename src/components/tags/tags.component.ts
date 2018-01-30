import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';


@Component({
  selector: 'Tags',
  templateUrl: 'tags.component.html'
})
export class Tags {
  @Input() tags: string[];

  constructor(
    private routerService: RouterService,
    private sanitizer: DomSanitizer,
    private settingsService: SettingsService,
  ) {

  }


}

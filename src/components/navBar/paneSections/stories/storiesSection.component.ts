import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../../../services/settings.service';
import { RouterService } from '../../../../services/router.service';

@Component({
  selector: 'StoriesNavSection',
  templateUrl: 'storiesSection.component.html'
})
export class StoriesNavSection {

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private sanitizer: DomSanitizer
  ) {}

  navigateToPost(story) {
    this.routerService.navigateToPage(`/post/${story.id}/${story.title.split(' ').join('-')}`);
  }
}

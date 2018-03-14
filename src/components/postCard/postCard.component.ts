import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';
import { UtilService } from '../../services/util.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'PostCard',
  templateUrl: 'postCard.component.html'
})
export class PostCard {
  @Input() data: Post;
  @Input() displayAuthor = true;
  @Input() displayImage = true;
  @Input() displayDescription = false;

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private sanitizer: DomSanitizer,
    private utilService: UtilService
  ) {

  }

  navigateToPost() {
    this.routerService.navigateToPage(`/stories/post/${this.data.id}/${this.data.title.split(' ').join('-')}`);
  }
}

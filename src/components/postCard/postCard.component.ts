import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'PostCard',
  templateUrl: 'postCard.component.html'
})
export class PostCard {
  @Input() data: Post;
  @Input() displayAuthor = true;
  @Input() displayImage = true;

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private sanitizer: DomSanitizer,
  ) {

  }

  navigateToPost() {
    this.routerService.navigateToPage(`/post/${this.data.id}/${this.data.title.split(' ').join('-')}`);
  }
}

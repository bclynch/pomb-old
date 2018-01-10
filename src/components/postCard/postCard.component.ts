import { Component, Input } from '@angular/core';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'PostCard',
  templateUrl: 'postCard.component.html'
})
export class PostCard {
  @Input() data: Post;

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService
  ) {

  }

  navigateToPost() {
    this.routerService.navigateToPage(`/post/${this.data.id}/${this.data.title.split(' ').join('-')}`);
  }
}

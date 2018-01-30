import { Component, Input, OnChanges } from '@angular/core';

import { RouterService } from '../../services/router.service';
import { SettingsService } from '../../services/settings.service';
import { Post } from '../../models/Post.model';

@Component({
  selector: 'PostWrapper',
  templateUrl: 'postWrapper.component.html'
})
export class PostWrapper implements OnChanges {
  @Input() post: Post;

  galleryImages = [];
  tags: string[] = [];

  constructor(
    private routerService: RouterService,
    private settingsService: SettingsService
  ) {  }

  ngOnChanges() {
    if (this.post) {
      this.post.imagesByPostId.nodes.forEach((image) => {
        if (image.type === 'GALLERY') this.galleryImages.push(image);
      });
      this.tags = this.post.postToTagsByPostId.nodes.map((tag) => tag.postTagByPostTagId.name);
    }
  }

}

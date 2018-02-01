import { Component, Input, OnChanges } from '@angular/core';

import { RouterService } from '../../services/router.service';
import { SettingsService } from '../../services/settings.service';
import { AnalyticsService } from '../../services/analytics.service';
import { Post } from '../../models/Post.model';
import { ImageType } from '../../models/Image.model';

@Component({
  selector: 'PostWrapper',
  templateUrl: 'postWrapper.component.html'
})
export class PostWrapper implements OnChanges {
  @Input() post: Post;

  galleryImages = [];
  tags: string[] = [];
  views: number;

  constructor(
    private routerService: RouterService,
    private settingsService: SettingsService,
    private analyticsService: AnalyticsService
  ) {  }

  ngOnChanges() {
    if (this.post) {
      this.post.imagesByPostId.nodes.forEach((image) => {
        if (image.type === ImageType['GALLERY']) this.galleryImages.push(image);
      });
      this.tags = this.post.postToTagsByPostId.nodes.map((tag) => tag.postTagByPostTagId.name);

      this.analyticsService.getPageViews().then(
        result => {
          const data = <any>result;
          this.views = data.views;
        }
      );
    }
  }

}

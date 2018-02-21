import { Component, Input, OnChanges } from '@angular/core';

import { RouterService } from '../../services/router.service';
import { SettingsService } from '../../services/settings.service';
import { AnalyticsService } from '../../services/analytics.service';
import { UserService } from '../../services/user.service';

import { Post } from '../../models/Post.model';
import { ImageType } from '../../models/Image.model';

@Component({
  selector: 'PostWrapper',
  templateUrl: 'postWrapper.component.html'
})
export class PostWrapper implements OnChanges {
  @Input() post: Post;
  @Input() isPreview = false;

  galleryImages = [];
  tags: string[] = [];
  views: number;
  disqusId: string;

  relatedPosts: Post[] = [];

  constructor(
    private routerService: RouterService,
    private settingsService: SettingsService,
    private analyticsService: AnalyticsService,
    private userService: UserService
  ) { }

  ngOnChanges() {
    if (this.post) {
      this.disqusId = `post/${this.post.id}`;
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

      if (!this.isPreview) this.populateRelatedPosts();
    }
  }

  populateRelatedPosts(): void {
    this.relatedPosts = [];
    if (this.tags.length) {
      this.post.postToTagsByPostId.nodes[0].postTagByPostTagId.postToTagsByPostTagId.nodes.forEach((post) => {
        if (this.relatedPosts.map(obj => obj.id).indexOf(post.postByPostId.id) === -1 && post.postByPostId.id !== this.post.id) {
          this.relatedPosts.push(post.postByPostId);
        }
      });
    }
  }
}

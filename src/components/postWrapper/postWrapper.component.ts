import { Component, Input, OnChanges } from '@angular/core';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'PostWrapper',
  templateUrl: 'postWrapper.component.html'
})
export class PostWrapper implements OnChanges {
  @Input() post: Post;

  galleryImages = [];

  constructor(

  ) { }

  ngOnChanges() {
    if (this.post) {
      this.post.imagesByPostId.nodes.forEach((image) => {
        if (image.type === 'GALLERY') this.galleryImages.push(image);
      });
    }
  }

}

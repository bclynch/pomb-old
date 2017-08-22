import { Component, Input } from '@angular/core';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'PostWrapper',
  templateUrl: 'postWrapper.component.html'
})
export class PostWrapper {
  @Input() post: Post;

  constructor(

  ) { }

}

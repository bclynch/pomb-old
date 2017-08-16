import { Component, Input } from '@angular/core';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'PostList',
  templateUrl: 'postList.component.html'
})
export class PostList {
  @Input() data: Post[];

  constructor(

  ) { }

}

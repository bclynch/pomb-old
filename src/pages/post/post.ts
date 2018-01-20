import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { APIService } from '../../services/api.service';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage implements OnInit {

  post;

  constructor(
    private apiService: APIService,
    private router: Router
  ) {  }

  ngOnInit() {
    const postId = +this.router.url.split('/')[2];
    console.log(postId);
    this.apiService.getPostById(postId).valueChanges.subscribe(
      data => {
        this.post = data.data.postById;
        console.log(this.post);
      }
    );
  }
}

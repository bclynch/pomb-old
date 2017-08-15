import { Component, OnInit } from '@angular/core';

import { APIService } from '../../services/api.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  posts: Post[] = [];
  gridPosts: Post[] = [];
  compactHeroPost: Post = null;
  otherPosts: Post[] = [];
  gridConfiguration: number[] = [ 6.5, 3.5, 3.5, 6.5, 3, 3, 3 ];

  constructor(
    private apiService: APIService
  ) {  }

  ngOnInit() {
    this.apiService.getAllPosts().subscribe(({ data }) => {
      console.log('got data: ', data.allPosts.nodes);
      this.posts = data.allPosts.nodes;
      this.gridPosts = this.posts.slice(0,this.gridConfiguration.length);
      this.compactHeroPost = this.posts.slice(this.gridConfiguration.length, this.gridConfiguration.length + 1)[0];
      this.otherPosts = this.posts.slice(this.gridConfiguration.length + 1);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

}

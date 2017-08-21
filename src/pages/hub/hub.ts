import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { APIService } from '../../services/api.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'page-hub',
  templateUrl: 'hub.html'
})
export class HubPage implements OnInit {

  currentHub: string;
  tagInformation = null;
  posts: Post[] = [];
  gridPosts: Post[] = [];
  otherPosts: Post[] = [];
  gridConfiguration: number[] = [ 5, 5 ];

  constructor(
    private apiService: APIService,
    private router: Router
  ) {  
    this.currentHub = this.router.url.split('?')[0].split('/')[1].charAt(0).toUpperCase() + this.router.url.split('?')[0].split('/')[1].slice(1);
  }

  ngOnInit() {
    this.apiService.getTagByName(this.currentHub).subscribe(
      ({ data }) => {
        console.log(data);
        this.tagInformation = data.allPostTags.nodes[0];
        this.apiService.getPostsByTag(this.tagInformation.id).subscribe(({ data }) => {
          console.log('got data: ', data);
          this.posts = data.postsByTag.nodes;
          this.gridPosts = this.posts.slice(0,this.gridConfiguration.length);
          this.otherPosts = this.posts.slice(this.gridConfiguration.length);
        },(error) => {
          console.log('there was an error sending the query', error);
        });
      }
    )
  }

}

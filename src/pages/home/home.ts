import { Component, OnInit } from '@angular/core';

import { APIService } from '../../services/api.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  posts = [];
  gridPosts = [];
  gridConfiguration: number[] = [ 3, 7, 7, 3, 5, 5 ];

  constructor(
    private apiService: APIService
  ) {  }

  ngOnInit() {
    this.apiService.getAllPosts().subscribe(({ data }) => {
      console.log('got data: ', data.allPosts.nodes);
      this.posts = data.allPosts.nodes;
      this.gridPosts = this.posts.slice(0,this.gridConfiguration.length);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { APIService } from '../../services/api.service';
import { RouterService } from '../../services/router.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'page-search-results',
  templateUrl: 'searchResults.html'
})
export class SearchResultsPage implements OnInit {

  posts: Post[] = [];

  constructor(
    private apiService: APIService,
    private router: Router,
    private routerService: RouterService
  ) {  

  }

  ngOnInit() {
    console.log(this.routerService.params);
    this.apiService.searchPosts(this.routerService.params.q).subscribe(
      data => {
        this.posts = data.data.searchPosts.nodes;
        console.log(this.posts);
      }
    );
  }

}

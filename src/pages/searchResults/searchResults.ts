import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../../services/api.service';
import { RouterService } from '../../services/router.service';
import { SettingsService } from '../../services/settings.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'page-search-results',
  templateUrl: 'searchResults.html'
})
export class SearchResultsPage implements OnInit {

  posts: Post[] = [];
  query: string;

  constructor(
    private apiService: APIService,
    private router: Router,
    private routerService: RouterService,
    private settingsService: SettingsService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      console.log(params);
    });
    // subscribe to param change to update results
    this.router.events.subscribe(e => {
      if (e.constructor.name === 'RoutesRecognized') {
        const navData = <any> e;
        this.query = navData.url.split('=')[1];
        this.runSearch();
      }
    });
  }

  ngOnInit() {
    this.settingsService.modPageTitle('Search Results');
    console.log(this.routerService.params);
    this.query = this.routerService.params.q;
    this.runSearch();
  }

  runSearch(): void {
    // using :* to it'll be an open ended search
    this.apiService.searchPosts(`${this.query}:*`).valueChanges.subscribe(
      data => {
        this.posts = data.data.searchPosts.nodes;
        console.log(this.posts);
      }
    );
  }

}

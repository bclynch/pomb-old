import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { APIService } from '../../services/api.service';
import { RouterService } from '../../services/router.service';
import { SettingsService } from '../../services/settings.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'page-search-results',
  templateUrl: 'searchResults.html'
})
export class SearchResultsPage {

  postResults: Post[] = [];
  tripResults = [];
  accountResults = [];
  query: string;

  constructor(
    private apiService: APIService,
    private router: Router,
    private routerService: RouterService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.query = params.q;
      this.runSearch();
    });

    this.settingsService.modPageMeta('Search Results', `See user, trip, and juncture results for the query ${this.query}`);
  }

  runSearch(): void {
    // using :* to it'll be an open ended search
    this.apiService.searchSite(`${this.query}:*`).valueChanges.subscribe(
      results => {
        console.log('SEARCH RESULTS: ', results.data);
        this.postResults = results.data.searchPosts.nodes;
        this.tripResults = results.data.searchTrips.nodes;
        this.accountResults = results.data.searchAccounts.nodes;

        // maybe we run followup query for the missing data we need aka post img, post author, trip img, etc
      }
    );
  }

}

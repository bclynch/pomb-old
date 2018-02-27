import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../../services/api.service';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { RouterService } from '../../services/router.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'page-archive',
  templateUrl: 'archive.html'
})
export class ArchivePage {

  archivePage: number;
  totalPages: number;
  posts: Post[] = [];
  gridPosts: Post[] = [];
  otherPosts: Post[] = [];
  gridConfiguration: number[] = [ 5, 5 ];

  constructor(
    private apiService: APIService,
    private router: Router,
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private routerService: RouterService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.archivePage = params.page ? +params.page : 1;
      this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
    });
  }

  init() {
    this.settingsService.modPageMeta(`Stories Archive - Page ${this.archivePage}`, 'Listing of older stories and posts from around the Pack On My Back community.');

    // fetch posts offset correctly based on page param
    this.apiService.getAllPublishedPosts(20, 20 * this.archivePage).valueChanges.subscribe(
      result => {
        this.totalPages = Math.ceil((result.data.allPosts.totalCount - 20) / 20);

        this.posts = result.data.allPosts.nodes;
        this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
        this.otherPosts = this.posts.slice(this.gridConfiguration.length);
      }
    );
  }
}

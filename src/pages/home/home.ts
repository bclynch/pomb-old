import { Component } from '@angular/core';

import { APIService } from '../../services/api.service';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { UtilService } from '../../services/util.service';
import { RouterService } from '../../services/router.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  posts: Post[] = [];
  gridPosts: Post[] = [];
  compactHeroPost: Post = null;
  otherPosts: Post[] = [];
  gridConfiguration: number[] = [ 6.5, 3.5, 3.5, 6.5, 3, 3, 3 ];

  constructor(
    private apiService: APIService,
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private utilService: UtilService,
    private routerService: RouterService
  ) {
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    this.settingsService.modPageMeta('Stories', 'See what new posts are available from around Pack On My Back. Learn and be inspired by our users stories.');
    this.apiService.getAllPublishedPosts(20, 0).valueChanges.subscribe(({ data }) => {
      // console.log('got data: ', data.allPosts.nodes);
      this.posts = data.allPosts.nodes;
      this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
      this.compactHeroPost = this.posts.slice(this.gridConfiguration.length, this.gridConfiguration.length + 1)[0];
      this.otherPosts = this.posts.slice(this.gridConfiguration.length + 1);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  navigateToPost(post: Post) {
    this.routerService.navigateToPage(`/stories/post/${post.id}/${post.title.split(' ').join('-')}`);
  }

  navigateToAuthor(e, username: string) {
    // stop bubbling to other click listener
    e.stopPropagation();

    this.routerService.navigateToPage(`/user/${username}`);
  }
}

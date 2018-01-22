import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../../services/api.service';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { RouterService } from '../../services/router.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  posts: Post[] = [];
  gridPosts: Post[] = null;
  compactHeroPost: Post = null;
  otherPosts: Post[] = [];
  gridConfiguration: number[] = [ 6.5, 3.5, 3.5, 6.5, 3, 3, 3 ];
  username: string;
  user;
  ready = false;

  constructor(
    private apiService: APIService,
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private router: Router,
    private route: ActivatedRoute,
    private routerService: RouterService
  ) {
    this.route.params.subscribe((params) => {
      this.username = params.username;
      this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
    });
  }

  init() {
    this.settingsService.modPageTitle(`${this.username}'s profile`);
    // check if this is an actual user + grab data
    this.apiService.getAccountByUsername(this.username).valueChanges.subscribe(({ data }) => {
      this.user = data.accountByUsername;
      console.log('got user data: ', this.user);
      if (this.user) {
        this.posts = this.user.postsByAuthor.nodes;
        this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
        this.ready = true;
      } else {
        // username doesnt exist
        alert('this username doesnt exist!');
        this.routerService.navigateToPage('/');
      }
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

}

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../../services/api.service';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { RouterService } from '../../services/router.service';

import { Post } from '../../models/Post.model';
import { User } from '../../models/User.model';

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
  user: User;
  ready = false;

  stats: { icon: string; label: string; value: number, customIcon?: boolean }[] = [];

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
    this.settingsService.modPageMeta(`${this.username}'s profile`, `View ${this.username}'s profile with trip, juncture, and photo information to share and inspire!`);
    // check if this is an actual user + grab data
    this.apiService.getAccountByUsername(this.username).valueChanges.subscribe(({ data }) => {
      this.user = data.accountByUsername;
      console.log('got user data: ', this.user);
      if (this.user) {
        this.posts = this.user.postsByAuthor.nodes;
        this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
        this.populateStats();
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

  populateStats(): void {
    // populate stats
    const stats = [];

    // stats.push({ icon: 'md-globe', label: 'Countries', value: 1 });
    stats.push({ icon: 'md-plane', label: 'Trips', value: this.user.totalTripCount.totalCount });
    stats.push({ icon: 'md-git-merge', label: 'Junctures', value: this.user.totalJunctureCount.totalCount });
    stats.push({ icon: 'md-albums', label: 'Posts', value: this.user.totalPostCount.totalCount });
    stats.push({ icon: 'md-images', label: 'Photos', value: this.user.totalImageCount.totalCount });
    stats.push({ icon: '../../assets/images/track.svg', label: 'Trackers', value: this.user.tracksByTrackUserId.totalCount, customIcon: true });
    stats.push({ icon: 'logo-rss', label: 'Tracking', value: this.user.tracksByUserId.totalCount });

    this.stats = stats;
  }
}

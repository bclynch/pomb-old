import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { APIService } from '../../services/api.service';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { RouterService } from '../../services/router.service';
import { UserService } from '../../services/user.service';

import { Post } from '../../models/Post.model';
import { User } from '../../models/User.model';
import { ImageType } from '../../models/Image.model';

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
  gallery: { url: string; description: string; accountByUserId: { username: string }; totalLikes: { totalCount: number }; likesByUser: { nodes: { id: number }[] }; id: number; }[] = [];
  username: string;
  user: User;
  inited = false;

  stats: { icon: string; label: string; value: number, customIcon?: boolean }[] = [];
  countriesVisited: [string, string][] = [['Country', 'Name']];
  mapWidth: string;

  constructor(
    private apiService: APIService,
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private router: Router,
    private route: ActivatedRoute,
    private routerService: RouterService,
    private sanitizer: DomSanitizer,
    private userService: UserService
  ) {
    this.route.params.subscribe((params) => {
      // reset arrays
      this.countriesVisited = [['Country', 'Name']];
      this.gallery = [];

      this.username = params.username;
      this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
    });
  }

  init() {
    this.settingsService.modPageMeta(`${this.username}'s profile`, `View ${this.username}'s profile with trip, juncture, and photo information to share and inspire!`);
    // check if this is an actual user + grab data
    this.apiService.getAccountByUsername(this.username, this.userService.user ? this.userService.user.id : null).valueChanges.subscribe(({ data }) => {
      this.user = data.accountByUsername;
      console.log('got user data: ', this.user);
      if (this.user) {
        this.posts = this.user.postsByAuthor.nodes;
        this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
        this.populateStats();
        this.populateCountriesVisited();
        this.mapWidth = window.innerWidth > 1280 ? '1280px' : '100vw';

        // populate img array
        for (let i = 0; i < this.user.imagesByUserId.nodes.length; i++) {
          const img = this.user.imagesByUserId.nodes[i];
          this.gallery.push({ url: img.url, description: img.description, accountByUserId: { username: img.accountByUserId.username }, totalLikes: img.totalLikes, likesByUser: img.likesByUser, id: img.id });
          if (this.gallery.length === 12) break;
        }
        this.inited = true;
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

  populateCountriesVisited() {
    this.countriesVisited = [['Country', 'Name']];
    this.user.userToCountriesByUserId.nodes.forEach((country) => {
      this.countriesVisited.push([ country.countryByCountry.code.toLowerCase(), country.countryByCountry.name ]);
    });
  }
}

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../../services/api.service';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';

import { Post, PostCategory } from '../../models/Post.model';

@Component({
  selector: 'page-hub',
  templateUrl: 'hub.html'
})
export class HubPage {

  isTripPosts = false;
  currentHub: string;
  hubDescription = null;
  posts: Post[] = [];
  gridPosts: Post[] = [];
  otherPosts: Post[] = [];
  gridConfiguration: number[] = [ 5, 5 ];

  constructor(
    private apiService: APIService,
    private router: Router,
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      if (params.tag) {
        this.currentHub = params.tag;
      } else if (params.tripId) {
        this.currentHub = params.tripId;
        this.isTripPosts = true;
      }

      this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
    });
  }

  init() {
    this.settingsService.modPageTitle(this.currentHub);
    if (this.isTripPosts) {
      this.apiService.getPostsByTrip(+this.router.url.split('/')[2]).valueChanges.subscribe(
        data => {
          const tripPosts = [];
          console.log(data);
          const tripData = <any>data;
          this.currentHub = `${tripData.data.tripById.name} Posts`;
          this.settingsService.modPageTitle(this.currentHub);
          const junctures = tripData.data.tripById.juncturesByTripId.nodes;
          junctures.forEach((juncture) => {
            const juncturePosts = juncture.junctureToPostsByJunctureId.nodes;
            if (juncturePosts.length) juncturePosts.forEach((post) => {
              tripPosts.push(post.postByPostId);
            });
          });
          this.posts = tripPosts;
          this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
          this.otherPosts = this.posts.slice(this.gridConfiguration.length);
        }
      );
    } else {
      this.apiService.getPostsByCategory(PostCategory[this.currentHub]).valueChanges.subscribe(({ data }) => {
        console.log('got category posts: ', data.allPosts.nodes);
        this.posts = data.allPosts.nodes;
        this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
        this.otherPosts = this.posts.slice(this.gridConfiguration.length);
      }, (error) => {
        console.log('there was an error sending the query', error);
      });
    }
  }
}

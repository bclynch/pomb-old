import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../../services/api.service';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';

import { Post } from '../../models/Post.model';

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
    // if it's a trip get posts by trip id otherwise by post tag
    if (this.isTripPosts) {
      this.apiService.getPostsByTrip(+this.currentHub).valueChanges.subscribe(
        data => {
          const tripPosts = [];
          const tripData = <any>data;
          this.currentHub = `${tripData.data.tripById.name} Posts`;
          this.settingsService.modPageMeta(`${tripData.data.tripById.name} Posts`, `See all posts from the trip, ${tripData.data.tripById.name}, as it chronicles a journey with Pack On My Back`);
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
      this.apiService.getPostsByTag(this.currentHub).valueChanges.subscribe(({ data }) => {
        this.settingsService.modPageMeta(this.currentHub, `See all posts from the ${this.currentHub} tag`);
        this.posts = data.allPostToTags.nodes.map((node) => node.postByPostId);
        this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
        this.otherPosts = this.posts.slice(this.gridConfiguration.length);
      },
      (error) => console.log('there was an error sending the query', error));
    }
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
    private broadcastService: BroadcastService
  ) {
    if (this.router.url.split('/')[1] === 'trip') this.isTripPosts = true;
    this.currentHub = this.router.url.split('?')[0].split('/')[1].charAt(0).toUpperCase() + this.router.url.split('?')[0].split('/')[1].slice(1);
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    // const category = this.settingsService.siteSections[this.currentHub];
    // console.log(category);
    // this.hubDescription = category.description;
    // this.apiService.getPostsByCategory(PostCategory[this.currentHub]).subscribe(({ data }) => {
    //   console.log('got category posts: ', data.allPosts.nodes);
    //   this.posts = data.allPosts.nodes;
    //   this.gridPosts = this.posts.slice(0,this.gridConfiguration.length);
    //   this.otherPosts = this.posts.slice(this.gridConfiguration.length);
    // },(error) => {
    //   console.log('there was an error sending the query', error);
    // });
    if (this.isTripPosts) {
      this.apiService.getPostsByTrip(+this.router.url.split('/')[2]).valueChanges.subscribe(
        data => {
          const tripPosts = [];
          console.log(data);
          const tripData = <any>data;
          this.currentHub = `${tripData.data.tripById.name} Posts`;
          const junctures = tripData.data.tripById.tripToJuncturesByTripId.nodes;
          junctures.forEach((juncture) => {
            const juncturePosts = juncture.junctureByJunctureId.junctureToPostsByJunctureId.nodes;
            if (juncturePosts.length) juncturePosts.forEach((post) => {
              tripPosts.push(post.postByPostId);
            });
          });
          this.posts = tripPosts;
          this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
          this.otherPosts = this.posts.slice(this.gridConfiguration.length);
        }
      );
    }
  }
}

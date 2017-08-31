import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { APIService } from '../../services/api.service';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'page-hub',
  templateUrl: 'hub.html'
})
export class HubPage {

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
    this.currentHub = this.router.url.split('?')[0].split('/')[1].charAt(0).toUpperCase() + this.router.url.split('?')[0].split('/')[1].slice(1);
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init()); 
  }

  init() {
    const category = this.settingsService.appCategories[this.currentHub];
    console.log(category);
    this.hubDescription = category.description;
    this.apiService.getPostsByCategory(category.id).subscribe(({ data }) => {
      console.log('got category posts: ', data);
      this.posts = data.postsByCategory.nodes;
      this.gridPosts = this.posts.slice(0,this.gridConfiguration.length);
      this.otherPosts = this.posts.slice(this.gridConfiguration.length);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }
}

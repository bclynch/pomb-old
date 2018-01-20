import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  currentArchive: string;
  archiveDescription = null;
  posts: Post[] = [];
  gridPosts: Post[] = [];
  otherPosts: Post[] = [];
  gridConfiguration: number[] = [ 5, 5 ];

  constructor(
    private apiService: APIService,
    private router: Router,
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private routerService: RouterService
  ) {
    this.currentArchive = this.routerService.params.tag;

    this.apiService.getTagByName(this.currentArchive).valueChanges.subscribe(
      ({ data }) => {
        console.log(data);
        this.archiveDescription = data.allPostTags.nodes[0].tagDescription;
        this.apiService.getPostsByTag(data.allPostTags.nodes[0].id).valueChanges.subscribe(({ data }) => {
          console.log('got tag posts: ', data);
          this.posts = data.postsByTag.nodes;
          this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
          this.otherPosts = this.posts.slice(this.gridConfiguration.length);
        }, (error) => {
          console.log('there was an error sending the query', error);
        });
      }
    );
  }
}

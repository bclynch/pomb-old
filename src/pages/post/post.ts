import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../../services/api.service';
import { BroadcastService } from '../../services/broadcast.service';
import { SettingsService } from '../../services/settings.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {

  post;
  postId: number;

  constructor(
    private apiService: APIService,
    private router: Router,
    private route: ActivatedRoute,
    private broadcastService: BroadcastService,
    private settingsService: SettingsService,
    private userService: UserService
  ) {
    this.route.params.subscribe((params) => {
      this.postId = params.id;
      this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
    });
  }

  init() {
    console.log(this.userService.user);
    this.apiService.getPostById(this.postId, this.userService.user ? this.userService.user.id : null).valueChanges.subscribe(
      data => {
        this.post = data.data.postById;
        console.log(this.post);
        this.settingsService.modPageTitle(this.post.title);
      }
    );
  }
}

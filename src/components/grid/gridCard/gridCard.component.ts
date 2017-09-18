import { Component, Input } from '@angular/core';

import { SettingsService } from '../../../services/settings.service';
import { RouterService } from '../../../services/router.service';

import { Post } from '../../../models/Post.model';

@Component({
  selector: 'GridCard',
  templateUrl: 'gridCard.component.html'
})
export class GridCard {
  @Input() data: Post;
  @Input() size: number;

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService
  ) { 

  }

  navigateToPost() {
    this.routerService.navigateToPage(`/post/${this.data.id}/${this.data.title.split(' ').join('-')}`);
  }
}

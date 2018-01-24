import { Component, Input, OnInit } from '@angular/core';

import { SettingsService } from '../../../services/settings.service';
import { RouterService } from '../../../services/router.service';

import { Post } from '../../../models/Post.model';

@Component({
  selector: 'GridCard',
  templateUrl: 'gridCard.component.html'
})
export class GridCard implements OnInit {
  @Input() data: Post;
  @Input() size: number;

  thumbnailImage: string;

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService
  ) { }

  ngOnInit() {
    this.data.imagesByPostId.nodes.forEach((img) => {
      if (img.type === 'LEAD_LARGE') this.thumbnailImage = img.url;
    });
  }

  navigateToPost() {
    this.routerService.navigateToPage(`/post/${this.data.id}/${this.data.title.split(' ').join('-')}`);
  }
}

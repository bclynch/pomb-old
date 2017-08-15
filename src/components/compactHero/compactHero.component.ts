import { Component, Input } from '@angular/core';

import { SettingsService } from '../../services/settings.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'CompactHero',
  templateUrl: 'compactHero.component.html'
})
export class CompactHero {
  @Input() post: Post;

  constructor(
    private settingsService: SettingsService
  ) { }

}

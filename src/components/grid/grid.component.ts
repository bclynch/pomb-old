import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'Grid',
  templateUrl: 'grid.component.html'
})
export class Grid {
  @Input() gridConfig: number[];
  @Input() posts = [];

  constructor(
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer
  ) { }

}

import { Component, Input, OnInit } from '@angular/core';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'Grid',
  templateUrl: 'grid.component.html'
})
export class Grid {
  @Input() gridConfig: number[];
  @Input() posts = [];

  constructor(
    private settingsService: SettingsService
  ) { }

}

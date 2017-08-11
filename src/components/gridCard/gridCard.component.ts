import { Component, Input } from '@angular/core';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'GridCard',
  templateUrl: 'gridCard.component.html'
})
export class GridCard {
  @Input() data;
  @Input() size: number;

  constructor(
    private settingsService: SettingsService
  ) { 

  }

}

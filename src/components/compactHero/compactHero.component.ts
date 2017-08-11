import { Component, Input } from '@angular/core';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'CompactHero',
  templateUrl: 'compactHero.component.html'
})
export class CompactHero {
  @Input() post;

  constructor(
    private settingsService: SettingsService
  ) { }

}

import { Component, Input } from '@angular/core';

import { SettingsService } from '../../services/settings.service';

import { Juncture } from '../../models/Juncture.model';

@Component({
  selector: 'JunctureBubbles',
  templateUrl: 'junctureBubbles.component.html'
})
export class JunctureBubbles {
  @Input() junctures: Juncture[];

  constructor(
    private settingsService: SettingsService
  ) { }

}

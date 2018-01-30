import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../../services/settings.service';
import { JunctureService } from '../../../services/juncture.service';
import { RouterService } from '../../../services/router.service';

import { Juncture } from '../../../models/Juncture.model';

@Component({
  selector: 'JunctureBubble',
  templateUrl: 'junctureBubble.component.html'
})
export class JunctureBubble {
  @Input() juncture: Juncture;

  constructor(
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
    private junctureService: JunctureService,
    private routerService: RouterService
  ) { }

  junctureImage(juncture) {
    return juncture.markerImg || this.junctureService.defaultMarkerImg;
  }
}

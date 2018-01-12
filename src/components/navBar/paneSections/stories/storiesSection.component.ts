import { Component, Input } from '@angular/core';
import { SettingsService } from '../../../../services/settings.service';

@Component({
  selector: 'StoriesNavSection',
  templateUrl: 'storiesSection.component.html'
})
export class StoriesNavSection {

  constructor(
    private settingsService: SettingsService
  ) {}

}

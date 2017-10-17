import { Component, Input } from '@angular/core';
import { SettingsService } from '../../../../services/settings.service';

interface Social {
  icon: string;
  url: string;
  label: string;
}

@Component({
  selector: 'TravelNavSection',
  templateUrl: 'travelSection.component.html'
})
export class TravelNavSection {
  @Input() socialOptions: Social;

  constructor(
    private settingsService: SettingsService
  ) {}

}

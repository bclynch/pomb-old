import { Component, Input } from '@angular/core';
import { SettingsService } from '../../../../services/settings.service';

interface Social {
  icon: string;
  url: string;
  label: string;
}

@Component({
  selector: 'OutdoorsNavSection',
  templateUrl: 'outdoorsSection.component.html'
})
export class OutdoorsNavSection {
  @Input() socialOptions: Social;

  constructor(
    private settingsService: SettingsService
  ) {}

}

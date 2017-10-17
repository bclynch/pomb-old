import { Component, Input } from '@angular/core';
import { SettingsService } from '../../../../services/settings.service';

interface Social {
  icon: string;
  url: string;
  label: string;
}

@Component({
  selector: 'CommunityNavSection',
  templateUrl: 'communitySection.component.html'
})
export class CommunityNavSection {
  @Input() socialOptions: Social;

  constructor(
    private settingsService: SettingsService
  ) {}

}

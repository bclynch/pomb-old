import { Component, Input } from '@angular/core';
import { SettingsService } from '../../../../services/settings.service';
import { RouterService } from '../../../../services/router.service';
import { ExploreService } from '../../../../services/explore.service';

interface Social {
  icon: string;
  url: string;
  label: string;
}

@Component({
  selector: 'ExploreNavSection',
  templateUrl: 'exploreSection.component.html'
})
export class ExploreNavSection {

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private exploreService: ExploreService
  ) {}

  navigateToRegion(region: string) {
    this.routerService.navigateToPage(`/explore/region/${region.split(' ').join('-').toLowerCase()}`);
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';
import { ExploreService } from '../../services/explore.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'ExploreSubnav',
  templateUrl: 'exploreSubnav.component.html'
})
export class ExploreSubnav {
  @Input() options: string[];
  @Input() country: string[];
  @Output() optionSelect = new EventEmitter<string>();

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private exploreService: ExploreService,
    private utilService: UtilService
  ) {

  }

  navigateSubOption(option: string) {
    const optionFormatted = this.utilService.formatForURLString(option);
    this.routerService.modifyFragment(optionFormatted);
    this.optionSelect.emit(optionFormatted);
  }
}

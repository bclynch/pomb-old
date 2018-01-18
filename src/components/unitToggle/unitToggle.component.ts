import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { LocalStorageService } from '../../services/localStorage.service';

@Component({
  selector: 'UnitToggle',
  templateUrl: 'unitToggle.component.html'
})
export class UnitToggle {

  selected: 'imperial' | 'metric';

  constructor(
    private settingsService: SettingsService,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer
  ) {
    this.selected = this.settingsService.unitOfMeasure;
  }

  onToggleChange(selection: 'imperial' | 'metric') {
    if (selection !== this.selected) {
      this.selected = selection;
      this.settingsService.changeUnitOfMeasure(selection);
      this.localStorageService.set('unitOfMeasure', selection);
    }
  }
}

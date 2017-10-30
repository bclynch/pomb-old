import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { SettingsService } from '../../../services/settings.service';

interface Section {
  label: string;
  value: string;
}

@Component({
  selector: 'MobileNavModal',
  templateUrl: 'mobileNavModal.html'
})
export class MobileNavModal {

  modalData;
  sectionOptions: Section[] = [];

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams,
    private settingsService: SettingsService,
  ) {
    this.snagCategories();
  }

  dismiss(type: string) {
    this.viewCtrl.dismiss(type);
  }

  snagCategories() {
    Object.keys(this.settingsService.siteSections).forEach((category) => {
      this.sectionOptions.push({ label: category, value: category.toLowerCase() });
    });
  }
}

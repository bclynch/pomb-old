import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

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
  activeSection: number;
  subSections: any = {};

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams,
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
  ) {
    this.snagCategories();
  }

  dismiss(type: string) {
    this.viewCtrl.dismiss(type);
  }

  snagCategories() {
    Object.keys(this.settingsService.siteSections).forEach((category) => {
      this.sectionOptions.push({ label: category, value: category.toLowerCase() });

      // populate subSections
      if (category === 'Stories') {
        this.subSections[category] = this.settingsService.siteSections[category].subSections.map((section) => section.charAt(0).toUpperCase() + section.slice(1));
        this.subSections[category].unshift('Stories Hub');
      } else {
        this.subSections[category] = this.settingsService.siteSections[category].subSections;
      }
    });
  }
}

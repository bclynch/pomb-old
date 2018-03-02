import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';

interface Guide {
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'PlaceGuide',
  templateUrl: 'placeGuide.component.html'
})
export class PlaceGuide implements OnInit {
  @Input() selectedOptions: string[];

  guides: Guide[] = [];
  options = {
    visa: {
      name: 'Visas',
      icon: 'md-filing',
      description: 'Information you need to know for getting in and out of the country without issue'
    },
    climate: {
      name: 'Climate',
      icon: 'md-partly-sunny',
      description: 'Know what to expect the weather to be when you go'
    },
    money: {
      name: 'Money and Costs',
      icon: 'md-cash',
      description: 'Currency and budget information so your wallet is as ready as you are'
    }
  };

  constructor(
    private sanitizer: DomSanitizer,
    private settingsService: SettingsService
  ) {

  }

  ngOnInit() {
    this.selectedOptions.forEach((option) => {
      this.guides.push(this.options[option]);
    });
  }

}

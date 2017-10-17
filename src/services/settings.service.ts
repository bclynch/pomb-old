import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { ExploreService } from './explore.service';

@Injectable()

export class SettingsService {

  appInited: boolean = false;
  primaryColor: string;
  secondaryColor: string;
  tagline: string;
  heroBanner: string;

  siteSections: any = {
    'Travel': { description: '' },
    'Outdoors': { description: '' },
    'Explore': { description: '' },
    'Community': { description: '' },
    'Profile': { description: '' },
  };
  categoryOptions: string[] = ['Trekking', 'Biking', 'Travel', 'Culture', 'Gear'];

  constructor(
    private apiService: APIService,
    private exploreService: ExploreService
  ) {   }

  appInit() {
    let promises = [];

    //countries data
    promises.push(this.exploreService.init());

    let promise2 = new Promise<string>((resolve, reject) => {
      this.apiService.getConfig().subscribe(
        data => {
          const appSettings = data.data.allConfigs.nodes[0];
          console.log(appSettings);
          this.primaryColor = appSettings.primaryColor;
          this.secondaryColor = appSettings.secondaryColor;
          this.tagline = appSettings.tagline;
          this.heroBanner = appSettings.heroBanner;
          resolve();
        },
        err => reject(err)
      )
    });
    promises.push(promise2);

    return Promise.all(promises);
  }
}
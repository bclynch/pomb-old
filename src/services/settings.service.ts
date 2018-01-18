import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { APIService } from './api.service';
import { ExploreService } from './explore.service';
import { LocalStorageService } from './localStorage.service';

@Injectable()

export class SettingsService {

  appInited = false;
  primaryColor: string;
  secondaryColor: string;
  tagline: string;
  heroBanner: string;

  private unitOfMeasureSubject: BehaviorSubject<void>;
  public unitOfMeasure$: Observable<void>;
  public unitOfMeasure: 'imperial' | 'metric';

  siteSections: any = {
    'Community': { description: '' },
    'Stories': { description: '' },
    // 'Explore': { description: '' },
    'My Pack': { description: '' },
  };
  categoryOptions: string[] = ['Trekking', 'Biking', 'Travel', 'Culture', 'Gear'];

  constructor(
    private apiService: APIService,
    private exploreService: ExploreService,
    private localStorageService: LocalStorageService
  ) {
    this.unitOfMeasureSubject = new BehaviorSubject(null);
    this.unitOfMeasure$ = this.unitOfMeasureSubject.asObservable();
    this.unitOfMeasure = 'imperial';
  }

  appInit() {
    const promises = [];

    // check local storage for unit of measure
    const unitType = this.localStorageService.get('unitOfMeasure');
    if (unitType) {
      this.changeUnitOfMeasure(unitType);
    } else {
      this.localStorageService.set('unitOfMeasure', this.unitOfMeasure);
    }

    // countries data
    promises.push(this.exploreService.init());

    const promise2 = new Promise<string>((resolve, reject) => {
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
      );
    });
    promises.push(promise2);

    return Promise.all(promises);
  }

  changeUnitOfMeasure(unitType: 'imperial' | 'metric') {
    this.unitOfMeasure = unitType;
    this.unitOfMeasureSubject.next(null);
  }
}

import { Injectable } from '@angular/core';
import { APIService } from './api.service';

@Injectable()

export class SettingsService {

  appInited: boolean = false;
  primaryColor: string;
  secondaryColor: string;
  tagline: string;
  heroBanner: string;

  appCategories: any = {
    'Trekking': { description: '' },
    'Biking': { description: '' },
    'Culture': { description: '' },
    'Travel': { description: '' },
    'Gear': { description: '' },
  };

  constructor(
    private apiService: APIService
  ) {   }

  grabAppSettings() {
    let promises = [];

    // let promise1 = new Promise<string>((resolve, reject) => {
    //   this.apiService.getAllPostCategories().subscribe(
    //     data => {
    //       let categoriesData = <any>data;
    //       //format data
    //       categoriesData.data.allPostCategories.nodes.forEach((category) => {
    //         this.appCategories[category.name] = { description: category.categoryDescription, id: category.id };
    //       });
    //       resolve();
    //     },
    //     err => reject(err)
    //   )
    // });
    // promises.push(promise1);

    let promise2 = new Promise<string>((resolve, reject) => {
      this.apiService.getConfig().subscribe(
        data => {
          const appSettings = data.data.allConfigs.nodes[0];
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
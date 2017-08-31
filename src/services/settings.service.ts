import { Injectable } from '@angular/core';
import { APIService } from './api.service';

@Injectable()

export class SettingsService {

  appInited: boolean = false;
  primaryColor: string = '#e1ff00';
  secondaryColor: string = '#04c960';

  appCategories: any = {};

  constructor(
    private apiService: APIService
  ) {   }

  grabAppSettings() {
    //will be grabbing banner img, colors, categories here. Would be nice to make it one call to grab all this, I think Apollo/postgraph can do it (I had asked in gitter maybe?)
    // in the mean time just categories
    return new Promise<string>((resolve, reject) => {
      this.apiService.getAllPostCategories().subscribe(
        data => {
          let categoriesData = <any>data;
          //format data
          categoriesData.data.allPostCategories.nodes.forEach((category) => {
            this.appCategories[category.name] = { description: category.categoryDescription, id: category.id };
          });
          this.appInited = true;
          resolve();
        },
        err => reject(err)
      )
    });
  }
}
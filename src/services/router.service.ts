import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationExtras } from '@angular/router';
import 'rxjs/add/operator/filter';

// Services
import { APIService } from '../services/api.service';

interface urlData {
  segmentId: string;
  folderId: string;
  assetId: string; 
}

@Injectable()
export class RouterService {

  params;
  baseURL: string = this.router.url.split('?')[0];
  activeRoute: string; //used by nav component

  constructor(
    private apiService: APIService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params) => {
        console.log('params: ', params);
        this.params = params;
    });
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event) => {
        console.log('NavigationEnd:', event);
        const eventData = <any>event;
        this.baseURL = eventData.url.split('?')[0];
        this.activeRoute = this.baseURL.split('/')[1];
      });
  }

  modifyQueryParams(fileTypes, tags) {
    console.log(fileTypes);
    let params: any = {};
    if(fileTypes.length) {
      params.fileTypes = fileTypes;
    }
    //will likely need to do something with these different filters 
    if(tags.length) {
      params.tags = tags;
    }

    //maintain search query if it exists
    if(this.params.q) {
      params.q = this.params.q;
    }

    let paramsObj = { queryParams : params };

    this.router.navigate([`${this.baseURL}`], paramsObj);
  }

  navigateToPage(path: string) {
    let navigationExtras: NavigationExtras = {
      queryParamsHandling: 'preserve',
      preserveFragment: true
    };

    this.router.navigate([path], {queryParams: navigationExtras});
  }

}
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { BroadcastService } from '../../../services/broadcast.service';

@Component({
  selector: 'page-explore-city',
  templateUrl: 'explore.city.html'
})
export class ExploreCityPage {

  carouselImages;
  city;

  constructor(
    private apiService: APIService,
    private router: Router,
    private settingsService: SettingsService,
    private utilService: UtilService,
    private route: ActivatedRoute,
    private broadcastService: BroadcastService
  ) {  
    this.route.params.subscribe(params => {
      //grab city name
      this.city = this.utilService.formatURLString(params.city);
      
      if(this.settingsService.appInited) this.init();
    });

    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());    
  }

  init() {
    //grab flickr images for the carousel
    this.apiService.getFlickrPhotos(this.city, 'architecture', 5).subscribe(
      result => {
        console.log(result.photos.photo);
        const photos = result.photos.photo.slice(0, 5);
        this.carouselImages = photos.map((photo) => {
          //_b is 'large' img request so 1024 x 768. We'll go with this for now
          //_o is 'original' which is 2400 x 1800
          return { imgURL: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`, tagline: photo.title };
        });
      }
    )
  }
}

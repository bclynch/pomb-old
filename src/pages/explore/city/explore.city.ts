import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';

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
    private utilService: UtilService
  ) {  
    //grab city name
    const city = this.router.url.split('/').slice(-1)[0].split('#')[0];
    this.city = this.utilService.formatURLString(city);

    //grab flickr images for the carousel
    this.apiService.getFlickrPhotos(this.city, 'architecture').subscribe(
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

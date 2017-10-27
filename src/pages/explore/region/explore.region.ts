import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from 'ionic-angular';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { ExploreService } from '../../../services/explore.service';
import { BroadcastService } from '../../../services/broadcast.service';
import { UtilService } from '../../../services/util.service';

import { ExploreModal } from '../../../components/modals/exploreModal/exploreModal';

@Component({
  selector: 'page-explore-region',
  templateUrl: 'explore.region.html'
})
export class ExploreRegionPage {

  countryCodes: string[][];
  inited = false;
  region = {code: '', name: ''};

  carouselImages;

  modalData = [

  ];

  constructor(
    private apiService: APIService,
    private router: Router,
    private settingsService: SettingsService,
    private exploreService: ExploreService,
    private broadcastService: BroadcastService,
    private modalController: ModalController,
    private utilService: UtilService
  ) {  
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init()); 
  }

  init() {
    //grab region name
    const region = this.router.url.split('/').slice(-1)[0];
    this.region.name = this.utilService.formatURLString(region);
    this.region.code = this.exploreService.getGoogleCodeByName(this.region.name);

    //check if its a region or subregion
    if(Object.keys(this.exploreService.regions).indexOf(region) === -1) {
      //we know its a subregion. Need to find its parent to include for grabbing codes
      this.countryCodes = this.exploreService.requestCountryCodes(null, region);
    } else {
      this.countryCodes = this.exploreService.requestCountryCodes(region);
    }

    //grab flickr images for the carousel
    this.apiService.getFlickrPhotos(this.region.name, 'landscape').subscribe(
      result => {
        console.log(result.photos.photo);
        const photos = result.photos.photo.slice(0, 5);
        this.carouselImages = photos.map((photo) => {
          //_b is 'large' img request so 1024 x 768. We'll go with this for now
          //_o is 'original' which is 2400 x 1800
          return { imgURL: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`, tagline: photo.title };
        });
        this.inited = true;
      }
    )
  }

  presentModal() {
    let modal = this.modalController.create(ExploreModal, { data: this.modalData }, { cssClass: 'exploreModal' });
    modal.present();
  }
}

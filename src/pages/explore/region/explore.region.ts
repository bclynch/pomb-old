import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  currentRegion = {code: '', name: ''};
  isSubregion: boolean;
  urlParams;

  carouselImages;

  modalData = [
    {
      label: 'Popular Countries',
      items: []
    }
  ];

  constructor(
    private apiService: APIService,
    private router: Router,
    private settingsService: SettingsService,
    private exploreService: ExploreService,
    private broadcastService: BroadcastService,
    private modalController: ModalController,
    private utilService: UtilService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.urlParams = params;
      //check if subregion
      this.isSubregion = params.subregion ? true : false;
      //grab region name
      this.currentRegion.name = this.isSubregion ? this.utilService.formatURLString(params.subregion) : this.utilService.formatURLString(params.region);
      
      if(this.settingsService.appInited) this.init();
    });

    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init()); 
  }

  init() {
    this.currentRegion.code = this.exploreService.getGoogleCodeByName(this.currentRegion.name);

    this.countryCodes = this.isSubregion ? this.exploreService.requestCountryCodes(this.urlParams.region, this.currentRegion.name) : this.exploreService.requestCountryCodes(this.currentRegion.name);

    //grab flickr images for the carousel
    this.apiService.getFlickrPhotos(this.currentRegion.name, 'landscape', 5).subscribe(
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

    //populate modal data
    this.modalData[0].items = this.countryCodes.slice(1, 11).reduce((a, b) => {
      return a.concat(b);
    }, []);
  }

  presentModal() {
    let modal = this.modalController.create(ExploreModal, { data: this.modalData }, { cssClass: 'exploreModal' });
    modal.present();
  }
}

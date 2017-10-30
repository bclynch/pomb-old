import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { APIService } from '../../services/api.service';
import { SettingsService } from '../../services/settings.service';
import { ExploreService } from '../../services/explore.service';
import { BroadcastService } from '../../services/broadcast.service';

import { ExploreModal } from '../../components/modals/exploreModal/exploreModal';

@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html'
})
export class ExplorePage {

  countryCodes: string[][];

  carouselImages;
  inited = false;

  modalData = [
    {
      label: 'Popular Regions',
      items: ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania']
    },
    {
      label: 'Popular Countries',
      items: ['China', 'France', 'Spain', 'Brazil', 'Iceland', 'South Africa', 'Japan', 'Russia', 'Mexico', 'India']
    }
  ];

  constructor(
    private apiService: APIService,
    private settingsService: SettingsService,
    private exploreService: ExploreService,
    private broadcastService: BroadcastService,
    private modalController: ModalController
  ) {  
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init()); 
  }

  init() {
    this.countryCodes = this.exploreService.requestCountryCodes('all');

    //grab flickr images for the carousel
    this.apiService.getFlickrPhotos('travel', 'landscape', 5).subscribe(
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

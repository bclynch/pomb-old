import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, Content } from 'ionic-angular';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { BroadcastService } from '../../../services/broadcast.service';
import { RouterService } from '../../../services/router.service';
import { ExploreService } from '../../../services/explore.service';

import { ExploreModal } from '../../../components/modals/exploreModal/exploreModal';

@Component({
  selector: 'page-explore-country',
  templateUrl: 'explore.country.html'
})
export class ExploreCountryPage {

  carouselImages;

  modalData = [
    {
      label: 'Popular Cities',
      items: []
    },
  ];

  subnavOptions = ['At a Glance', 'Essential Information', 'Map', 'Posts', 'Activities'];

  country: string;

  glanceSubsection = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet pharetra magna. Nulla pretium, ligula eu ullamcorper volutpat, libero diam malesuada est, vel euismod sapien turpis bibendum nulla. Donec tincidunt sed mauris et auctor. Curabitur malesuada lectus id elit vehicula efficitur.';
  glanceContent = [
    { title: 'Section 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet pharetra magna. Nulla pretium, ligula eu ullamcorper volutpat, libero diam malesuada est, vel euismod sapien turpis bibendum nulla. Donec tincidunt sed mauris et auctor. Curabitur malesuada lectus id elit vehicula efficitur.' },
    { title: 'Section 2', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet pharetra magna. Nulla pretium, ligula eu ullamcorper volutpat, libero diam malesuada est, vel euismod sapien turpis bibendum nulla. Donec tincidunt sed mauris et auctor. Curabitur malesuada lectus id elit vehicula efficitur.' },
    { title: 'Section 3', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet pharetra magna. Nulla pretium, ligula eu ullamcorper volutpat, libero diam malesuada est, vel euismod sapien turpis bibendum nulla. Donec tincidunt sed mauris et auctor. Curabitur malesuada lectus id elit vehicula efficitur.' },
  ];
  glanceExpanded = false;

  constructor(
    private apiService: APIService,
    private router: Router,
    private settingsService: SettingsService,
    private modalController: ModalController,
    private utilService: UtilService,
    private broadcastService: BroadcastService,
    private routerService: RouterService,
    private exploreService: ExploreService,
    private route: ActivatedRoute
  ) {  
    this.route.params.subscribe(params => {
      //grab country name
      this.country = this.utilService.formatURLString(params.country);
      
      if(this.settingsService.appInited) this.init();
    });

    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init()); 
  }

  init() {
    //grab flickr images for the carousel
    this.apiService.getFlickrPhotos(this.country, 'landscape', 5).subscribe(
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

    //grab cities for modal
    this.apiService.getCities(this.exploreService.countryNameObj[this.country].alpha2Code).subscribe(
      result => {
        console.log(result.geonames);
        result.geonames.forEach((city) => {
          this.modalData[0].items.push(city.toponymName);
        });
      }
    )
  }

  ngAfterViewInit(): void {
    try {
      document.getElementById(this.routerService.fragment).scrollIntoView();
    } catch (e) { }
  }

  scrollTo(option: string) {
    document.getElementById(option).scrollIntoView({behavior: 'smooth'});
  }

  presentModal() {
    let modal = this.modalController.create(ExploreModal, { data: this.modalData }, { cssClass: 'exploreModal' });
    modal.present();
  }
}

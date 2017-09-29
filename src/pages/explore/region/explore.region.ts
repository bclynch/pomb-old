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

  carouselImages: {}[] = [
    { imgURL: 'http://www.lifewallpapers.net/data/out/2/3473202-1200-x-800-wallpaper.jpg', tagline: 'crisp mountain air' }, 
    { imgURL: 'https://www.yosemitehikes.com/images/wallpaper/yosemitehikes.com-nevada-fall-1200x800.jpg', tagline: 'stone that reaches the sky' }, 
    { imgURL: 'http://www.jasoncarnew.com/wp-content/uploads/2013/03/fiord-1280x800.jpg', tagline: 'serene coastlines' }, 
    { imgURL: 'https://jzholloway.files.wordpress.com/2008/07/moon072608-5back.jpg', tagline: "your mom's cavern" }, 
    { imgURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Oslo_Lufthavn_flyfoto.jpg/1200px-Oslo_Lufthavn_flyfoto.jpg', tagline: 'your way about the world' }
  ];

  modalData = [
    {
      label: 'Popular Regions',
      items: ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania']
    },
    {
      label: 'Popular Countries',
      items: ['China', 'France', 'Spain', 'Brazil', 'Canada', 'South Africa', 'Japan', 'Russia', 'Mexico', 'India']
    }
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
    this.inited = true;
  }

  presentModal() {
    let modal = this.modalController.create(ExploreModal, { data: this.modalData }, { cssClass: 'exploreModal' });
    modal.present();
  }
}

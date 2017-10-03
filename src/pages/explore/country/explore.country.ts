import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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

  carouselImages: {}[] = [
    { imgURL: 'http://www.lifewallpapers.net/data/out/2/3473202-1200-x-800-wallpaper.jpg', tagline: 'land of crisp mountain air' }, 
    { imgURL: 'https://www.yosemitehikes.com/images/wallpaper/yosemitehikes.com-nevada-fall-1200x800.jpg', tagline: 'where stone that reaches the sky' }, 
    { imgURL: 'http://www.jasoncarnew.com/wp-content/uploads/2013/03/fiord-1280x800.jpg', tagline: 'is serene coastlines' }, 
    { imgURL: 'https://jzholloway.files.wordpress.com/2008/07/moon072608-5back.jpg', tagline: "is your mom's cavern" }, 
    { imgURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Oslo_Lufthavn_flyfoto.jpg/1200px-Oslo_Lufthavn_flyfoto.jpg', tagline: 'is your way about the world' }
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
    private exploreService: ExploreService
  ) {  
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init()); 
  }

  init() {
    //grab country name
    const country = this.router.url.split('/').slice(-1)[0].split('#')[0];
    this.country = this.utilService.formatURLString(country);
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

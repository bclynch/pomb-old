import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { APIService } from '../../services/api.service';
import { SettingsService } from '../../services/settings.service';
import { ExploreService } from '../../services/explore.service';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html'
})
export class ExplorePage {

  countryCodes: string[][];
  inited = false;

  carouselImages: {}[] = [
    { imgURL: 'http://www.lifewallpapers.net/data/out/2/3473202-1200-x-800-wallpaper.jpg', tagline: 'crisp mountain air' }, 
    { imgURL: 'https://www.yosemitehikes.com/images/wallpaper/yosemitehikes.com-nevada-fall-1200x800.jpg', tagline: 'stone that reaches the sky' }, 
    { imgURL: 'http://www.jasoncarnew.com/wp-content/uploads/2013/03/fiord-1280x800.jpg', tagline: 'serene coastlines' }, 
    { imgURL: 'https://jzholloway.files.wordpress.com/2008/07/moon072608-5back.jpg', tagline: "your mom's cavern" }, 
    { imgURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Oslo_Lufthavn_flyfoto.jpg/1200px-Oslo_Lufthavn_flyfoto.jpg', tagline: 'your way about the world' }
  ];

  constructor(
    private apiService: APIService,
    private router: Router,
    private settingsService: SettingsService,
    private exploreService: ExploreService,
    private broadcastService: BroadcastService
  ) {  
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init()); 
  }

  init() {
    this.countryCodes = this.exploreService.requestCountryCodes('all');
    this.inited = true;
  }

}

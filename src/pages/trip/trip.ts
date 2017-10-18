import { Component } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  selector: 'page-trip',
  templateUrl: 'trip.html'
})
export class TripPage {

  loaded: boolean = false;
  userLocation = { lat: null, lon: null }


  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
  ) {  
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
    //browser location
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((location) => {
        console.log(location.coords);
        this.userLocation.lat = location.coords.latitude;
        this.userLocation.lon = location.coords.longitude;
        this.loaded = true;
      });
    }
  }

  init() {
    
  }

}

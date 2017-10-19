import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MapsAPILoader, AgmMap } from '@agm/core';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { APIService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';

interface Marker {
  lat: number;
  lon: number;
}

@Component({
  selector: 'page-trip',
  templateUrl: 'trip.html'
})
export class TripPage {

  tripId: number;
  junctureMarkers: Marker[] = [];
  inited: boolean = false;
  latlngBounds;
  mapStyle;

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private apiService: APIService,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private utilService: UtilService
  ) {  
    this.tripId = +this.router.url.split('/').slice(-1);
    console.log(this.tripId);
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    this.apiService.getTripById(this.tripId).subscribe(({ data }) => {
      const tripData = data.tripById;
      console.log('got trip data: ', tripData);
      //create markers arr
      tripData.tripToJuncturesByTripId.nodes.forEach((marker) => {
        let newMarker: any = {};
        newMarker['lat'] = marker.junctureByJunctureId.lat;
        newMarker['lon'] = marker.junctureByJunctureId.lon;
        this.junctureMarkers.push(newMarker);
      });

      //fitting the map to the markers
      this.mapsAPILoader.load().then(() => {
        this.latlngBounds = new window['google'].maps.LatLngBounds();
        this.junctureMarkers.forEach((location) => {
            this.latlngBounds.extend(new window['google'].maps.LatLng(location.lat, location.lon))
        });

        //grab map style
        this.utilService.getJSON('../../assets/mapStyles/unsaturated.json').subscribe((data) => {
          this.mapStyle = data;
          this.inited = true;
        });
      });
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

}

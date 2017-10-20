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
  tripData;
  junctureMarkers: Marker[] = [];
  inited: boolean = false;
  latlngBounds;
  mapStyle;
  defaultPhoto: string = '../../assets/images/trip-default.jpg';
  junctureIndex: number = 0;
  junctureContentArr: any = [];

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
      this.tripData = data.tripById;
      console.log('got trip data: ', this.tripData);
      
      //fill up arr with a bunch of empty values so our styling works properly
      for(let i = 0; i < this.tripData.tripToJuncturesByTripId.nodes.length; i++) {
        this.junctureContentArr.push(null);
      }
      //populate first bit of our content for the pane
      this.modJunctureContentArr(0, this.tripData.tripToJuncturesByTripId.nodes[0].junctureByJunctureId.id);
      this.modJunctureContentArr(1, this.tripData.tripToJuncturesByTripId.nodes[1].junctureByJunctureId.id);

      //create markers arr
      this.tripData.tripToJuncturesByTripId.nodes.forEach((marker) => {
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

  changeIndex(i: number) {
    if(this.junctureIndex - i === 1) {
      this.junctureIndex = this.junctureIndex - 1;
    } else if(i - this.junctureIndex === 1) {
      this.junctureIndex = this.junctureIndex + 1;
      if(this.junctureIndex > 0 && this.junctureIndex < this.junctureMarkers.length - 1) this.modJunctureContentArr(this.junctureIndex + 1, this.tripData.tripToJuncturesByTripId.nodes[this.junctureIndex + 1].junctureByJunctureId.id);
    }
  }

  //Adding content one at a time so as not to make a big ass call every time that would take forever. One ahead so its always ready
  modJunctureContentArr(index: number, id: number) {
    this.apiService.getJunctureById(id).subscribe(({ data }) => {
      if(!this.junctureContentArr[index]) {
        this.junctureContentArr.splice(index, 1, data.junctureById);
      };
    });
  }
}

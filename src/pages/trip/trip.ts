import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MapsAPILoader, AgmMap } from '@agm/core';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { APIService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import { RouterService } from '../../services/router.service';

interface Marker {
  lat: number;
  lon: number;
  markerImage: string;
}

@Component({
  selector: 'page-trip',
  templateUrl: 'trip.html'
})
export class TripPage {
  @ViewChild(AgmMap) private map: any;

  tripId: number;
  tripData;
  junctureMarkers: Marker[] = [];
  inited: boolean = false;
  defaultPhoto: string = '../../assets/images/trip-default.jpg';
  junctureIndex: number = 0;
  junctureContentArr: any = [];
  tempPanStart: number;

  //map props
  coords: { lat: number; lon: number; } = { lat: null, lon: null };
  zoomLevel: number;
  latlngBounds;
  mapStyle;

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private apiService: APIService,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private utilService: UtilService,
    private routerService: RouterService 
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
      if(this.tripData.tripToJuncturesByTripId.nodes[0]) this.modJunctureContentArr(0, this.tripData.tripToJuncturesByTripId.nodes[0].junctureByJunctureId.id);
      if(this.tripData.tripToJuncturesByTripId.nodes[1]) this.modJunctureContentArr(1, this.tripData.tripToJuncturesByTripId.nodes[1].junctureByJunctureId.id);

      //create markers arr
      this.tripData.tripToJuncturesByTripId.nodes.forEach((marker) => {
        let newMarker: any = {};
        newMarker['lat'] = marker.junctureByJunctureId.lat;
        newMarker['lon'] = marker.junctureByJunctureId.lon;
        if(marker.junctureByJunctureId.junctureToPhotosByJunctureId.nodes.length) {
          newMarker['markerImage'] = marker.junctureByJunctureId.junctureToPhotosByJunctureId.nodes[0].photoUrl;
        } else {
          newMarker['markerImage'] = 'https://static.planetminecraft.com/files/avatar/1939407_1.gif'
        }
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
      //increment index of active juncture
      this.junctureIndex = this.junctureIndex - 1;

      //pan map to our new juncture location
      this.panToCoords(this.junctureMarkers[i].lat, this.junctureMarkers[i].lon);
    } else if(i - this.junctureIndex === 1) {
      //increment index of active juncture
      this.junctureIndex = this.junctureIndex + 1;

      //fetch new juncture data if required
      if(this.junctureIndex > 0 && this.junctureIndex < this.junctureMarkers.length - 1) this.modJunctureContentArr(this.junctureIndex + 1, this.tripData.tripToJuncturesByTripId.nodes[this.junctureIndex + 1].junctureByJunctureId.id);
      
      //pan map to our new juncture location
      this.panToCoords(this.junctureMarkers[i].lat, this.junctureMarkers[i].lon);
    }
  }

  //Adding content one at a time so as not to make a big ass call every time that would take forever. One ahead so its always ready
  modJunctureContentArr(index: number, id: number) {
    this.apiService.getJunctureById(id).subscribe(({ data }) => {
      const junctureData = this.processPosts(data.junctureById);
      if(!this.junctureContentArr[index]) {
        this.junctureContentArr.splice(index, 1, junctureData);
      };
    });
  }

  processPosts(juncture) {
    //some read only bullshit happening so doing manual copy of the obj...
    //this is gross AF
    const copy = {
      arrivalDate: juncture.arrivalDate,
      city: juncture.city,
      country: juncture.country,
      description: juncture.description,
      id: juncture.id,
      junctureToPhotosByJunctureId: juncture.junctureToPhotosByJunctureId,
      junctureToPostsByJunctureId: { nodes : null },
      name: juncture.name
    };
    const abc = juncture.junctureToPostsByJunctureId.nodes.map((post) => {
      return post.postByPostId;
    });
    copy.junctureToPostsByJunctureId = abc;
    return copy;
  }

  panToCoords(lat: number, lon: number) {
    this.coords.lat = lat;
    this.coords.lon = lon;
    this.zoomLevel = 7;
    this.map._mapsWrapper.panTo({lat: this.coords.lat, lng: this.coords.lon});
  }

  onZoomChange(e) {
    this.zoomLevel = e;
  }

  panStart(e) {
    // console.log(e);
    this.tempPanStart = e.center.x;
  }

  panEnd(e) {
    // console.log(e);
    if (e.additionalEvent === 'panright') {
      if (e.center.x - this.tempPanStart > 200) {
        if(this.junctureIndex > 0) this.changeIndex(this.junctureIndex - 1);
      }
    } else if (e.additionalEvent === 'panleft') {
      if (this.tempPanStart - e.center.x > 200) {
        if(this.junctureIndex < this.junctureMarkers.length - 1) this.changeIndex(this.junctureIndex + 1);
      }
    }
    this.tempPanStart = 0;
  }
}

import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { AgmSnazzyInfoWindow } from '@agm/snazzy-info-window';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { APIService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'page-trip',
  templateUrl: 'trip.html'
})
export class TripPage {
  @ViewChild(AgmMap) private map: any;
  @ViewChildren(AgmSnazzyInfoWindow) snazzyWindowChildren: QueryList<any>;

  tripId: number;
  tripData;
  junctureMarkers = [];
  inited = false;
  defaultPhoto = '../../assets/images/trip-default.jpg';
  junctureIndex = 0;
  junctureContentArr: any = [];
  tempPanStart: number;
  markerLoading = false;

  // map props
  coords: { lat: number; lon: number; } = { lat: null, lon: null };
  zoomLevel: number;
  latlngBounds;
  geoJsonObject: any = null;
  mapStyle;
  boundedZoom: number;

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

      // fill up arr with a bunch of empty values so our styling works properly
      for (let i = 0; i < this.tripData.tripToJuncturesByTripId.nodes.length; i++) {
        this.junctureContentArr.push(null);
      }
      // populate first bit of our content for the pane
      if (this.tripData.tripToJuncturesByTripId.nodes[0]) this.modJunctureContentArr(0, this.tripData.tripToJuncturesByTripId.nodes[0].junctureByJunctureId.id);
      if (this.tripData.tripToJuncturesByTripId.nodes[1]) this.modJunctureContentArr(1, this.tripData.tripToJuncturesByTripId.nodes[1].junctureByJunctureId.id);

      this.junctureMarkers = this.tripData.tripToJuncturesByTripId.nodes;

      // trip coords
      const junctureArr = this.tripData.tripToJuncturesByTripId.nodes.map((juncture) => {
        // if its got gpx coords add them
        if (juncture.junctureByJunctureId.coordsByJunctureId.nodes.length) return juncture.junctureByJunctureId.coordsByJunctureId.nodes;

        // else add its manual marker coords
        return [{ lat: juncture.junctureByJunctureId.lat, lon: juncture.junctureByJunctureId.lon, elevation: 0, coordTime: new Date(+juncture.junctureByJunctureId.arrivalDate).toString() }];
      });
      console.log(junctureArr);
      this.geoJsonObject = this.generateGeoJSON(junctureArr);

      // fitting the map to the markers
      this.mapsAPILoader.load().then(() => {
        this.latlngBounds = new window['google'].maps.LatLngBounds();
        this.junctureMarkers.forEach((juncture) => {
          this.latlngBounds.extend(new window['google'].maps.LatLng(juncture.junctureByJunctureId.lat, juncture.junctureByJunctureId.lon));
        });
        // making sure to check first coord of first juncture to compensate for it
        this.latlngBounds.extend(new window['google'].maps.LatLng(this.geoJsonObject.geometry.coordinates[0][1], this.geoJsonObject.geometry.coordinates[0][0]));

        // grab map style
        this.utilService.getJSON('../../assets/mapStyles/unsaturated.json').subscribe( (data) => {
          this.mapStyle = data;
          this.inited = true;
        });
      });
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  styleFunc(feature) {
    return ({
      clickable: false,
      strokeColor: 'orange',
      strokeWeight: 3
    });
  }

  generateGeoJSON(data) {
    const geoJSON = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: []
      },
      properties: {
        name: 'Booger',
        coordTimes: []
      }
    };

    // WILL NEED TO FIGURE OUT ORDERING PROPERLY
    data.forEach((juncture) => {
      juncture.forEach((coords, i) => {
        geoJSON.geometry.coordinates.push([ coords.lon, coords.lat, coords.elevation ]);
        geoJSON.properties.coordTimes.push(coords.coordTime);
      });
    });

    console.log(geoJSON);

    return geoJSON;
  }

  changeIndex(i: number) {
    if (this.junctureIndex - i === 1) {
      // increment index of active juncture
      this.junctureIndex = this.junctureIndex - 1;

      // fetch new juncture data if required
      if (this.junctureIndex > 2) {
        this.modJunctureContentArr(this.junctureIndex - 1, this.tripData.tripToJuncturesByTripId.nodes[this.junctureIndex - 1].junctureByJunctureId.id);
      }

      // pan map to our new juncture location
      this.panToCoords(this.junctureMarkers[i].junctureByJunctureId.lat, this.junctureMarkers[i].junctureByJunctureId.lon);
    } else if (i - this.junctureIndex === 1) {
      // increment index of active juncture
      this.junctureIndex = this.junctureIndex + 1;

      // fetch new juncture data if required
      if (this.junctureIndex < this.junctureMarkers.length - 1) {
        this.modJunctureContentArr(this.junctureIndex + 1, this.tripData.tripToJuncturesByTripId.nodes[this.junctureIndex + 1].junctureByJunctureId.id);
      }

      // pan map to our new juncture location
      this.panToCoords(this.junctureMarkers[i].junctureByJunctureId.lat, this.junctureMarkers[i].junctureByJunctureId.lon);
    }
  }

  // Adding content one at a time so as not to make a big ass call every time that would take forever. One ahead so its always ready
  modJunctureContentArr(index: number, id: number) {
    return new Promise((resolve, reject) => {

      // make sure it doesn't already exist
      if (!this.junctureContentArr[index]) {
        this.apiService.getJunctureById(id).subscribe(({ data }) => {
          const junctureData = this.processPosts(data.junctureById);
          if (!this.junctureContentArr[index]) {
            this.junctureContentArr.splice(index, 1, junctureData);
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  markerClick(i: number) {
    this.markerLoading = true;
    // check to see if we have data for this marker. If not fetch
    this.modJunctureContentArr(i, this.junctureMarkers[i].junctureByJunctureId.id).then(() => this.markerLoading = false);
  }

  goToJuncture(i: number) {
    this.junctureIndex = i;

    // need to snag the data for juncture on either side so they're loaded up
    if (i > 2) this.modJunctureContentArr(i - 1, this.junctureMarkers[i - 1].junctureByJunctureId.id);
    if (i < this.junctureMarkers.length - 1) this.modJunctureContentArr(i + 1, this.junctureMarkers[i + 1].junctureByJunctureId.id);

    // programmatically close info window
    const livewindow = this.snazzyWindowChildren.find((window, index) => ( index === i ));
    livewindow._closeInfoWindow();
  }

  processPosts(juncture) {
    // some read only bullshit happening so doing manual copy of the obj...
    // this is gross AF
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
    this.zoomLevel = this.boundedZoom < 8 ? this.boundedZoom + 2 : this.boundedZoom + 1;
    this.map._mapsWrapper.panTo({lat: this.coords.lat, lng: this.coords.lon});
  }

  onZoomChange(e) {
    // if original bound zoom value failed then apply this
    if (!this.boundedZoom) this.boundedZoom = e;
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
        if (this.junctureIndex > 0) this.changeIndex(this.junctureIndex - 1);
      }
    } else if (e.additionalEvent === 'panleft') {
      if (this.tempPanStart - e.center.x > 200) {
        if (this.junctureIndex < this.junctureMarkers.length - 1) this.changeIndex(this.junctureIndex + 1);
      }
    }
    this.tempPanStart = 0;
  }

  truncate(text: string) {
    const ellipsis = text.length > 160 ? '...' : '';
    return text.slice(0, 200) + ellipsis;
  }

  mapReady(e) {
    // bounded zoom is what the map originally used based on bounds formula and is useful for panning around later
    // is undefined on load, but this works otherwise
    if (e.zoom) this.boundedZoom = e.zoom;
  }
}

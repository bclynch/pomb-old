import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, Content } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { MapsAPILoader, AgmMap } from '@agm/core';

import { APIService } from '../../services/api.service';
import { SettingsService } from '../../services/settings.service';
import { UtilService } from '../../services/util.service';
import { BroadcastService } from '../../services/broadcast.service';
import { RouterService } from '../../services/router.service';
import { GeoService } from '../../services/geo.service';
import { TripService } from '../../services/trip.service';
import { AlertService } from '../../services/alert.service';
import { ExploreService } from '../../services/explore.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'page-trip',
  templateUrl: 'trip.html'
})
export class TripPage implements AfterViewInit {

  carouselImages = [
    { imgURL: 'https://lonelyplanetimages.imgix.net/a/g/hi/t/4ad86c274b7e632de388dcaca5236ca8-asia.jpg', tagline: 'Wow' },
    { imgURL: 'https://lonelyplanetimages.imgix.net/a/g/hi/t/1dd17a448edb6c7ced392c6a7ea1c0ac-asia.jpg', tagline: 'Cool' },
    { imgURL: 'https://lonelyplanetimages.imgix.net/a/g/hi/t/b3960ccbee8a59ce113d0cce9f53f283-asia.jpg', tagline: 'Dang' }
  ];

  subnavOptions = ['Highlights', 'Map', 'Junctures', 'Posts', 'Photos'];

  tripId: number;
  tripData;
  trip = 'Dat Trip';

  dataLayerStyle;

  glanceSubsection = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet pharetra magna. Nulla pretium, ligula eu ullamcorper volutpat, libero diam malesuada est, vel euismod sapien turpis bibendum nulla. Donec tincidunt sed mauris et auctor. Curabitur malesuada lectus id elit vehicula efficitur.';
  glanceContent = [
    { title: 'Section 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet pharetra magna. Nulla pretium, ligula eu ullamcorper volutpat, libero diam malesuada est, vel euismod sapien turpis bibendum nulla. Donec tincidunt sed mauris et auctor. Curabitur malesuada lectus id elit vehicula efficitur.' },
    { title: 'Section 2', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet pharetra magna. Nulla pretium, ligula eu ullamcorper volutpat, libero diam malesuada est, vel euismod sapien turpis bibendum nulla. Donec tincidunt sed mauris et auctor. Curabitur malesuada lectus id elit vehicula efficitur.' },
    { title: 'Section 3', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet pharetra magna. Nulla pretium, ligula eu ullamcorper volutpat, libero diam malesuada est, vel euismod sapien turpis bibendum nulla. Donec tincidunt sed mauris et auctor. Curabitur malesuada lectus id elit vehicula efficitur.' },
  ];
  glanceExpanded = false;

  // map props
  coords: { lat: number; lon: number; } = { lat: null, lon: null };
  zoomLevel: number;
  latlngBounds;
  geoJsonObject: any = null;
  mapStyle;
  boundedZoom: number;

  countryFlags: { url: string; name: string; }[] = [];

  tripPosts: Post[] = [];

  constructor(
    private apiService: APIService,
    private router: Router,
    private settingsService: SettingsService,
    private modalController: ModalController,
    private utilService: UtilService,
    private broadcastService: BroadcastService,
    private routerService: RouterService,
    private geoService: GeoService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private tripService: TripService,
    private sanitizer: DomSanitizer,
    private mapsAPILoader: MapsAPILoader,
    private exploreService: ExploreService
  ) {
    this.route.params.subscribe((params) => {
      this.tripId = params.id;
      this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
    });
  }

  init() {
    this.countryFlags = [];

    this.apiService.getTripById(this.tripId).subscribe(({ data }) => {
      this.tripData = data.tripById;
      console.log('got trip data: ', this.tripData);
      this.trip = this.tripData.name;

      // trip coords
      const junctureArr = this.tripData.tripToJuncturesByTripId.nodes.map((juncture) => {
        // if its got gpx coords add them
        if (juncture.junctureByJunctureId.coordsByJunctureId.nodes.length) return juncture.junctureByJunctureId.coordsByJunctureId.nodes;

        // else add its manual marker coords
        return [{ lat: juncture.junctureByJunctureId.lat, lon: juncture.junctureByJunctureId.lon, elevation: 0, coordTime: new Date(+juncture.junctureByJunctureId.arrivalDate).toString() }];
      });
      // push starting trip marker to front of arr
      junctureArr.unshift([{ lat: this.tripData.startLat, lon: this.tripData.startLon, elevation: 0, coordTime: new Date(+this.tripData.startDate).toString() }]);
      this.geoJsonObject = this.geoService.generateGeoJSON(junctureArr);
      const junctureMarkers = this.tripData.tripToJuncturesByTripId.nodes;

      this.dataLayerStyle = {
        clickable: false,
        strokeColor: this.settingsService.secondaryColor,
        strokeWeight: 3
      };

      // populate flags array
      this.tripData.tripToJuncturesByTripId.nodes.forEach((juncture) => {
        if (this.countryFlags.indexOf(juncture.junctureByJunctureId.country) === -1) {
          this.countryFlags.push({ url: this.exploreService.getCountryFlag(juncture.junctureByJunctureId.country), name: juncture.junctureByJunctureId.country});
        }
      });
      // if it doesn't have url filter it out
      this.countryFlags = this.countryFlags.filter(obj => obj.url);

      // populate posts arr
      this.apiService.getPostsByTrip(this.tripData.id).subscribe(
        data => {
          const tripPosts = [];
          console.log(data);
          const tripData = <any>data;
          const junctures = tripData.data.tripById.tripToJuncturesByTripId.nodes;
          junctures.forEach((juncture) => {
            const juncturePosts = juncture.junctureByJunctureId.junctureToPostsByJunctureId.nodes;
            if (juncturePosts.length) juncturePosts.forEach((post) => {
              tripPosts.push(post.postByPostId);
            });
          });
          this.tripPosts = tripPosts.slice(0, 5);
        }
      );

      // fitting the map to the markers
      this.mapsAPILoader.load().then(() => {
        this.latlngBounds = new window['google'].maps.LatLngBounds();
        junctureMarkers.forEach((juncture) => {
          this.latlngBounds.extend(new window['google'].maps.LatLng(juncture.junctureByJunctureId.lat, juncture.junctureByJunctureId.lon));
        });
        // making sure to check trip start point to compensate for it
        this.latlngBounds.extend(new window['google'].maps.LatLng(this.tripData.startLat, this.tripData.startLon));

        // grab map style
        this.utilService.getJSON('../../assets/mapStyles/darkTheme.json').subscribe( (data) => {
          this.mapStyle = data;
        });
      });
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  ngAfterViewInit(): void {
    try {
      document.getElementById(this.routerService.fragment).scrollIntoView();
    } catch (e) { }
  }

  scrollTo(option: string) {
    document.getElementById(option).scrollIntoView({behavior: 'smooth'});
  }
}

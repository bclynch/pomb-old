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

  carouselImages: { imgURL: string; tagline: string; }[] = [];
  gallery: { url: string; description: string; }[] = [];

  subnavOptions = ['Highlights', 'Map', 'Junctures', 'Posts', 'Photos'];

  tripId: number;
  tripData;
  trip: number;

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
      this.tripId = params.tripId;
      this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
    });
  }

  init() {
    this.countryFlags = [];

    this.apiService.getTripById(this.tripId).valueChanges.subscribe(({ data }) => {
      this.tripData = data.tripById;
      console.log('got trip data: ', this.tripData);
      this.trip = this.tripData.name;
      this.settingsService.modPageTitle(this.tripData.name);

      this.carouselImages = [];
      this.gallery = [];
      // populate img arrays
      this.tripData.imagesByTripId.nodes.forEach((img) => {
        if (img.type === 'BANNER') this.carouselImages.push({ imgURL: img.url, tagline: img.title });
        if (img.type === 'GALLERY' && this.gallery.length < 12) this.gallery.push({ url: img.url, description: img.description });
      });

      // trip coords
      const junctureArr = this.tripData.juncturesByTripId.nodes.map((juncture) => {
        // if its got gpx coords add them
        if (juncture.coordsByJunctureId.nodes.length) return juncture.coordsByJunctureId.nodes;

        // else add its manual marker coords
        return [{ lat: juncture.lat, lon: juncture.lon, elevation: 0, coordTime: new Date(+juncture.arrivalDate).toString() }];
      });
      // push starting trip marker to front of arr
      junctureArr.unshift([{ lat: this.tripData.startLat, lon: this.tripData.startLon, elevation: 0, coordTime: new Date(+this.tripData.startDate).toString() }]);
      this.geoJsonObject = this.geoService.generateGeoJSON(junctureArr);
      const junctureMarkers = this.tripData.juncturesByTripId.nodes;

      this.dataLayerStyle = {
        clickable: false,
        strokeColor: this.settingsService.secondaryColor,
        strokeWeight: 3
      };

      // populate flags array
      this.tripData.juncturesByTripId.nodes.forEach((juncture) => {
        if (this.countryFlags.indexOf(juncture.country) === -1) {
          this.countryFlags.push({ url: this.exploreService.getCountryFlag(juncture.country), name: juncture.country});
        }
      });
      // if it doesn't have url filter it out
      this.countryFlags = this.countryFlags.filter(obj => obj.url);

      // populate posts arr
      this.apiService.getPostsByTrip(this.tripData.id).valueChanges.subscribe(
        data => {
          const tripPosts = [];
          console.log(data);
          const tripData = <any>data;
          const junctures = tripData.data.tripById.juncturesByTripId.nodes;
          junctures.forEach((juncture) => {
            const juncturePosts = juncture.postsByJunctureId.nodes;
            if (juncturePosts.length) juncturePosts.forEach((post) => {
              tripPosts.push(post);
            });
          });
          this.tripPosts = tripPosts.slice(0, 5);
        }
      );

      // fitting the map to the markers
      this.mapsAPILoader.load().then(() => {
        this.latlngBounds = new window['google'].maps.LatLngBounds();
        junctureMarkers.forEach((juncture) => {
          this.latlngBounds.extend(new window['google'].maps.LatLng(juncture.lat, juncture.lon));
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

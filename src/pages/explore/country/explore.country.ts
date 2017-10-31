import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, Content } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { MapsAPILoader, AgmMap } from '@agm/core';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { BroadcastService } from '../../../services/broadcast.service';
import { RouterService } from '../../../services/router.service';
import { ExploreService } from '../../../services/explore.service';
import { AlertService } from '../../../services/alert.service';

import { ExploreModal } from '../../../components/modals/exploreModal/exploreModal';

interface CityMarker {
  lat: number;
  lon: number;
  name: string;
  population: number;
}

@Component({
  selector: 'page-explore-country',
  templateUrl: 'explore.country.html'
})
export class ExploreCountryPage {

  carouselImages;

  modalData = [
    {
      label: 'Popular Cities',
      items: []
    },
  ];

  subnavOptions = ['At a Glance', 'Country Guide', 'Map', 'Posts', 'Activities'];

  country: string;

  glanceSubsection = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet pharetra magna. Nulla pretium, ligula eu ullamcorper volutpat, libero diam malesuada est, vel euismod sapien turpis bibendum nulla. Donec tincidunt sed mauris et auctor. Curabitur malesuada lectus id elit vehicula efficitur.';
  glanceContent = [
    { title: 'Section 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet pharetra magna. Nulla pretium, ligula eu ullamcorper volutpat, libero diam malesuada est, vel euismod sapien turpis bibendum nulla. Donec tincidunt sed mauris et auctor. Curabitur malesuada lectus id elit vehicula efficitur.' },
    { title: 'Section 2', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet pharetra magna. Nulla pretium, ligula eu ullamcorper volutpat, libero diam malesuada est, vel euismod sapien turpis bibendum nulla. Donec tincidunt sed mauris et auctor. Curabitur malesuada lectus id elit vehicula efficitur.' },
    { title: 'Section 3', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet pharetra magna. Nulla pretium, ligula eu ullamcorper volutpat, libero diam malesuada est, vel euismod sapien turpis bibendum nulla. Donec tincidunt sed mauris et auctor. Curabitur malesuada lectus id elit vehicula efficitur.' },
  ];
  glanceExpanded = false;

  latlngBounds;
  mapStyle;
  mapInited: boolean = false;
  cityMarkers: CityMarker[] = [];

  constructor(
    private apiService: APIService,
    private router: Router,
    private settingsService: SettingsService,
    private modalController: ModalController,
    private utilService: UtilService,
    private broadcastService: BroadcastService,
    private routerService: RouterService,
    private exploreService: ExploreService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private sanitizer: DomSanitizer,
    private mapsAPILoader: MapsAPILoader
  ) {
    this.route.params.subscribe(params => {
      //grab country name
      this.country = this.utilService.formatURLString(params.country);
      
      this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init()); 
    });
  }

  init() {
    //check if country exists
    if(this.exploreService.countryNameObj[this.country]) {
      //grab flickr images for the carousel
      this.apiService.getFlickrPhotos(this.country, 'landscape', 5).subscribe(
        result => {
          console.log(result.photos.photo);
          const photos = result.photos.photo.slice(0, 5);
          this.carouselImages = photos.map((photo) => {
            //_b is 'large' img request so 1024 x 768. We'll go with this for now
            //_o is 'original' which is 2400 x 1800
            return { imgURL: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`, tagline: photo.title };
          });
        }
      )

      //bounds data for map
      this.mapsAPILoader.load().then(() => {
        this.apiService.geocodeCoords(this.country).subscribe(
          result => {
            const viewport = result.geometry.viewport;
            const viewportBounds = [{lat: viewport.f.b, lon: viewport.b.b}, {lat: viewport.f.f, lon: viewport.b.f}]
            console.log(viewportBounds);

            this.latlngBounds = result.geometry.viewport;

            //grab map style
            this.utilService.getJSON('../../assets/mapStyles/unsaturated.json').subscribe((data) => {
              this.mapStyle = data;
              this.mapInited = true;
            });

            //grab cities for modal
            this.modalData[0].items = [];
            this.apiService.getCities(this.exploreService.countryNameObj[this.country].alpha2Code).subscribe(
              result => {
                console.log(result.geonames);
                result.geonames.forEach((city) => {
                  this.modalData[0].items.push(city.name);
                  this.cityMarkers.push({
                    lat: +city.lat,
                    lon: +city.lng,
                    name: city.name,
                    population: city.population
                  });
                });
                console.log(this.cityMarkers);
              }, err => console.log(err)
            )
          }
        );
      });
    } else {
      this.routerService.navigateToPage('/');
      this.alertService.alert('Error', 'The requested country does not exist');
    }
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
    modal.onDidDismiss((data) => {
      if(data) this.goToCity(data);
    });
    modal.present();
  }

  goToCity(city: string) {
    this.routerService.navigateToPage(`/explore/country/${this.utilService.formatForURLString(this.country)}/${this.utilService.formatForURLString(city)}`)
  }
}

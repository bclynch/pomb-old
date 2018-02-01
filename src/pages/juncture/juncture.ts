import { ViewChild, Component, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AgmMap, AgmDataLayer, MapsAPILoader } from '@agm/core';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { APIService } from '../../services/api.service';
import { GeoService } from '../../services/geo.service';
import { UtilService } from '../../services/util.service';
import { RouterService } from '../../services/router.service';

import { Juncture } from '../../models/Juncture.model';

@Component({
 selector: 'page-juncture',
 templateUrl: 'juncture.html'
})
export class JuncturePage {
  @ViewChild('distance') distance: any;
  @ViewChild('time') time: any;

  inited = false;
  junctureId: number;
  junctureData: Juncture;
  bannerImg: string;

  priorJuncture: Juncture;
  nextJuncture: Juncture;

  isProcessing = false;
  filesToUpload: Array<File> = [];

  isGPX = true;
  geoJsonObject = null;
  latlngBounds;
  mapStyle;
  dataLayerStyle;
  zoomLevel = 14;
  markerLat: number;
  markerLon: number;

  stats: { icon: string; iconColor: string; label: string; value: any; unitOfMeasure: string; }[];

  chartData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
        backgroundColor: 'rgba(95,44,130,0.2)',
        borderColor: 'rgba(95,44,130,1)',
      },
      {
        label: '# of Points',
        data: [7, 11, 5, 8, 3, 7],
        borderWidth: 1,
        backgroundColor: 'rgba(73, 160, 157,0.2)',
        borderColor: 'rgba(73, 160, 157,1)'
      }
    ]
  };

  chartOptions = {
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Neato Chart'
    },
    scales: {
      yAxes: [{
        ticks: {
          reverse: false
        }
      }]
    }
  };

  distanceChartData;
  distanceChartOptions;
  timeChartData;
  timeChartOptions;

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private apiService: APIService,
    private router: Router,
    private geoService: GeoService,
    private mapsAPILoader: MapsAPILoader,
    private utilService: UtilService,
    private route: ActivatedRoute,
    private routerService: RouterService
  ) {
    this.route.params.subscribe((params) => {
      this.junctureId = params.id;
      this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
    });

    // subscribing to UoM changes so we can modify data
    this.settingsService.unitOfMeasure$.subscribe(() => {
      if (this.inited) this.createLineCharts();
    });
  }

  init() {
    this.apiService.getFullJunctureById(this.junctureId).valueChanges.subscribe(({ data }) => {
      console.log(data.junctureById);
      this.settingsService.modPageTitle(data.junctureById.name);
      this.junctureData = data.junctureById;
      this.isGPX = this.junctureData.coordsByJunctureId.nodes.length ? true : false;

      // fitting the map to the data layer OR the marker
      this.mapsAPILoader.load().then(() => {
        // coerce lat / lon to numbers
        this.markerLat = +this.junctureData.lat;
        this.markerLon = +this.junctureData.lon;

        if (this.isGPX) {
          this.latlngBounds = new window['google'].maps.LatLngBounds();
          // take five coord pairs from the coords arr evenly spaced to hopefully encapsulate all the bounds
          const chosenCoords = [];
          const desiredNumberPairs = 5;
          for (let i = 0; i < this.junctureData.coordsByJunctureId.nodes.length && chosenCoords.length < desiredNumberPairs; i += Math.ceil(this.junctureData.coordsByJunctureId.nodes.length / desiredNumberPairs)) {
            chosenCoords.push(this.junctureData.coordsByJunctureId.nodes[i]);
          }

          chosenCoords.forEach((pair) => {
            this.latlngBounds.extend(new window['google'].maps.LatLng(pair.lat, pair.lon));
          });
        }

        // grab map style
        this.utilService.getJSON('../../assets/mapStyles/unsaturated.json').subscribe( (data) => {
          this.mapStyle = data;
        });
        this.dataLayerStyle = {
          clickable: false,
          strokeColor: this.settingsService.secondaryColor,
          strokeWeight: 3
        };
      });

      if (this.isGPX) this.createLineCharts();
      this.inited = true;

      // find prior juncture + next juncture
      for (let i = 0; i < this.junctureData.tripByTripId.juncturesByTripId.nodes.length; i++) {
        if (this.junctureData.tripByTripId.juncturesByTripId.nodes[i].id === this.junctureData.id) {
          // set prior juncture
          if (i !== 0) {
            this.priorJuncture = this.junctureData.tripByTripId.juncturesByTripId.nodes[i - 1];
          } else {
            this.priorJuncture = null;
          }

          // set next juncture
          if (i !== this.junctureData.tripByTripId.juncturesByTripId.nodes.length - 1) {
            this.nextJuncture = this.junctureData.tripByTripId.juncturesByTripId.nodes[i + 1];
          } else {
            this.nextJuncture = null;
          }

          break;
        }
      }

      // grab flickr images for the banner
      this.apiService.getFlickrPhotos(this.junctureData.city.trim(), 'landscape', 1, this.junctureData.country.trim()).subscribe(
        result => {
          console.log(result.photos.photo);
          if (result.photos.photo.length) {
            const photo = result.photos.photo[0];
            this.bannerImg = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
          } else {
            this.bannerImg = '../../assets/images/trip-default.jpg';
          }
        }
      );
    });
  }

  clicked(clickEvent) {
    console.log(clickEvent);
  }

  createLineCharts() {
    this.geoJsonObject = this.geoService.generateGeoJSON([this.junctureData.coordsByJunctureId.nodes]);
    console.log(this.geoJsonObject);

    // take our generated geojson and process into arras for charts
    const gpxData = this.geoService.crunchGPXData(this.geoJsonObject);
    console.log('CRUNCHED DATA: ', gpxData);

    // We want roughly 80-120 points per graph to be mindful of performance / look. Creating a filter number to arrive there
    // take number of data points and find reasonable divisor
    let filterDivisor;
    for (let i = 1; i < this.geoJsonObject.geometry.coordinates.length; i++) {
      if (this.geoJsonObject.geometry.coordinates.length / i < 120) {
        filterDivisor = i;
        break;
      }
    }
    console.log('FILTER Number: ', this.geoJsonObject.geometry.coordinates.length / filterDivisor);

    // set up statistics
    this.stats = [
      {
        icon: 'ios-walk-outline',
        iconColor: 'purple',
        label: 'Distance',
        value: this.settingsService.unitOfMeasure === 'metric' ? (gpxData.totalDistance / 1000).toFixed(2) : (gpxData.totalDistance).toFixed(2),
        unitOfMeasure: this.settingsService.unitOfMeasure === 'metric' ? 'kms' : 'miles'
      },
      {
        icon: 'md-time',
        iconColor: 'gold',
        label: 'Duration',
        value: this.utilService.msToTime(gpxData.stats.duration),
        unitOfMeasure: ''
      },
      {
        icon: 'ios-speedometer',
        iconColor: 'silver',
        label: 'Average Speed',
        value: this.settingsService.unitOfMeasure === 'metric' ? gpxData.stats.avgSpeed.toFixed(2) : this.utilService.kmsToMiles(gpxData.stats.avgSpeed).toFixed(2),
        unitOfMeasure: this.settingsService.unitOfMeasure === 'metric' ? 'km/h' : 'mph'
      },
      {
        icon: 'md-flame',
        iconColor: 'red',
        label: 'Max Speed',
        value: this.settingsService.unitOfMeasure === 'metric' ? gpxData.stats.maxSpeed.toFixed(2) : this.utilService.kmsToMiles(gpxData.stats.maxSpeed).toFixed(2),
        unitOfMeasure: this.settingsService.unitOfMeasure === 'metric' ? 'km/h' : 'mph'
      },
      {
        icon: 'md-trending-up',
        iconColor: 'teal',
        label: 'Climbing Distance',
        value: this.settingsService.unitOfMeasure === 'metric' ? Math.round(gpxData.stats.climb) : Math.round(this.utilService.metersToFeet(gpxData.stats.climb)),
        unitOfMeasure: this.settingsService.unitOfMeasure === 'metric' ? 'm' : 'ft'
      },
      {
        icon: 'md-trending-down',
        iconColor: 'blue',
        label: 'Descent Distance',
        value: this.settingsService.unitOfMeasure === 'metric' ? Math.round(gpxData.stats.descent) : Math.round(this.utilService.metersToFeet(gpxData.stats.descent)),
        unitOfMeasure: this.settingsService.unitOfMeasure === 'metric' ? 'm' : 'ft'
      },
    ];

    // creating x and y coords for our various graohs and filtering down to our deemed appropriate number of data points
    const elevationTimeData = this.geoJsonObject.geometry.coordinates.map((coord, i) => ( { x: gpxData.timeArr[i], y: this.settingsService.unitOfMeasure === 'metric' ? coord[2] : this.utilService.metersToFeet(coord[2]) } ) ).filter((_, i) => i % filterDivisor === 0);
    const speedTimeData = gpxData.speedsArr.map((speed, i) => ( { x: gpxData.timeArr[i], y: speed } ) ).filter((_, i) => i % filterDivisor === 0);
    const elevationDistanceData = this.geoJsonObject.geometry.coordinates.map((coord, i) => ( { x: this.settingsService.unitOfMeasure === 'metric' ? gpxData.distanceArr[i] / 1000 : gpxData.distanceArr[i], y: this.settingsService.unitOfMeasure === 'metric' ? coord[2] : this.utilService.metersToFeet(coord[2]) } ) ).filter((_, i) => i % filterDivisor === 0);
    const speedDistanceData = gpxData.speedsArr.map((speed, i) => ( { x: this.settingsService.unitOfMeasure === 'metric' ? gpxData.distanceArr[i] / 1000 : gpxData.distanceArr[i], y: speed } ) ).filter((_, i) => i % filterDivisor === 0);

    this.distanceChartData = {
      'datasets': [
        {
          label: 'Elevation',
          yAxisID: 'A',
          data: elevationDistanceData,
          backgroundColor: 'rgba(255,133,0,0.2)',
          borderColor: 'rgba(255,133,0,1)',
        }, {
          'label': 'Speed',
          yAxisID: 'B',
          'data': speedDistanceData,
          backgroundColor: 'rgba(0, 212, 255,0.2)',
          borderColor: 'rgba(0, 212, 255,1)',
        }
      ]
    };

    this.distanceChartOptions = {
      title: {
        display: true,
        text: 'Distance Chart'
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: `Distance (${this.settingsService.unitOfMeasure === 'metric' ? 'kms' : 'miles' })`
          },
          type: 'linear'
        }],
        yAxes: [{
          id: 'A',
          type: 'linear',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: `Elevation (${this.settingsService.unitOfMeasure === 'metric' ? 'm' : 'ft' })`
          }
        }, {
          id: 'B',
          type: 'linear',
          position: 'right',
          scaleLabel: {
            display: true,
            labelString: `Speed (${this.settingsService.unitOfMeasure === 'metric' ? 'km/h' : 'mi/h' })`
          }
        }]
      },
      events: ['click'],
      elements: {
        point: {
          radius: 0
        },
        line: {
          // tension: 0, // disables bezier curves
        }
      }
    };

    this.timeChartData = {
      'datasets': [
        {
          label: 'Elevation',
          yAxisID: 'A',
          data: elevationTimeData,
          backgroundColor: 'rgba(255,133,0,0.2)',
          borderColor: 'rgba(255,133,0,1)',
        }, {
          'label': 'Speed',
          yAxisID: 'B',
          'data': speedTimeData,
          backgroundColor: 'rgba(0, 212, 255,0.2)',
          borderColor: 'rgba(0, 212, 255,1)',
        }
      ]
    };

    this.timeChartOptions = {
      title: {
        display: true,
        text: 'Time Chart'
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            displayFormats: {
              quarter: 'HH:mm'
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }],
        yAxes: [{
          id: 'A',
          type: 'linear',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: `Elevation (${this.settingsService.unitOfMeasure === 'metric' ? 'm' : 'ft' })`
          }
        }, {
          id: 'B',
          type: 'linear',
          position: 'right',
          scaleLabel: {
            display: true,
            labelString: `Speed (${this.settingsService.unitOfMeasure === 'metric' ? 'km/h' : 'mi/h' })`
          }
        }]
      },
      events: ['click'],
      elements: {
        point: {
          radius: 0
        },
        line: {
          // tension: 0, // disables bezier curves
        }
      }
    };
  }
}

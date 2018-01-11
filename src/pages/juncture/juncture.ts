import { ViewChild, Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AgmMap, AgmDataLayer } from '@agm/core';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { APIService } from '../../services/api.service';
import { MappingService } from '../../services/mapping.service';

import Chart from 'chart.js';

@Component({
 selector: 'page-juncture',
 templateUrl: 'juncture.html'
})
export class JuncturePage {
  @ViewChild('distance') distance: any;
  @ViewChild('time') time: any;

  junctureId: number;
  junctureData;
  bannerImg: string;

  isProcessing = false;
  filesToUpload: Array<File> = [];

  isGPX: boolean;
  geoJsonObject = null;
  elevationTimeData: {}[];
  elevationDistanceData: {}[];
  speedTimeData: {}[];
  speedDistanceData: {}[];

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private apiService: APIService,
    private router: Router,
    private mappingService: MappingService
  ) {
    this.junctureId = +this.router.url.split('/').slice(-1);
    console.log(this.junctureId);
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    this.apiService.getFullJunctureById(this.junctureId).subscribe(({ data }) => {
      console.log(data.junctureById);
      this.junctureData = data.junctureById;
      this.isGPX = this.junctureData.coordsByJunctureId.nodes.length ? true : false;
      this.createLineCharts();

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

  styleFunc(feature) {
    return ({
      clickable: false,
      strokeColor: 'purple',
      strokeWeight: 3
    });
  }

  createLineCharts() {
    this.geoJsonObject = this.mappingService.generateGeoJSON([this.junctureData.coordsByJunctureId.nodes]);
    console.log(this.geoJsonObject);

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

    // creating x and y coords for our various graohs and filtering down to our deemed appropriate number of data points
    // this.elevationTimeData = this.geoJsonObject.geometry.coordinates.map((coord, i) => ( { x: result.data.timeArr[i], y: coord[2] } ) ).filter((_, i) => i % filterDivisor === 0);
    // this.speedTimeData = result.data.speedsArr.map((speed, i) => ( { x: result.data.timeArr[i], y: speed } ) ).filter((_, i) => i % filterDivisor === 0);
    // this.elevationDistanceData = this.geoJsonObject.geometry.coordinates.map((coord, i) => ( { x: result.data.distanceArr[i] / 1000, y: coord[2] } ) ).filter((_, i) => i % filterDivisor === 0);
    // this.speedDistanceData = result.data.speedsArr.map((speed, i) => ( { x: result.data.distanceArr[i] / 1000, y: speed } ) ).filter((_, i) => i % filterDivisor === 0);

    const distanceCtx = this.distance.nativeElement.getContext('2d');

      const distanceData = {
        'datasets': [
          {
            label: 'Elevation',
            yAxisID: 'A',
            data: this.elevationDistanceData,
            backgroundColor: 'rgba(255,133,0,0.2)',
            borderColor: 'rgba(255,133,0,1)',
          }, {
            'label': 'Speed',
            yAxisID: 'B',
            'data': this.speedDistanceData,
            backgroundColor: 'rgba(0, 212, 255,0.2)',
            borderColor: 'rgba(0, 212, 255,1)',
          }
        ]
      };

      const distanceOptions = {
        title: {
          display: true,
          text: 'Distance Chart'
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Distance (kms)'
            },
            type: 'linear'
          }],
          yAxes: [{
            id: 'A',
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Elevation (m)'
            }
          }, {
            id: 'B',
            type: 'linear',
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'Speed (km/h)'
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

      const distanceChart = new Chart(distanceCtx, {
        type: 'line',
        data: distanceData,
        options: distanceOptions
      });

      const timeCtx = this.time.nativeElement.getContext('2d');

        const timeData = {
          'datasets': [
            {
              label: 'Elevation',
              yAxisID: 'A',
              data: this.elevationTimeData,
              backgroundColor: 'rgba(255,133,0,0.2)',
              borderColor: 'rgba(255,133,0,1)',
            }, {
              'label': 'Speed',
              yAxisID: 'B',
              'data': this.speedTimeData,
              backgroundColor: 'rgba(0, 212, 255,0.2)',
              borderColor: 'rgba(0, 212, 255,1)',
            }
          ]
        };

        const timeOptions = {
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
                labelString: 'Elevation (m)'
              }
            }, {
              id: 'B',
              type: 'linear',
              position: 'right',
              scaleLabel: {
                display: true,
                labelString: 'Speed (km/h)'
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

        const timeChart = new Chart(timeCtx, {
          type: 'line',
          data: timeData,
          options: timeOptions
        });
  }

  private processFormData(): FormData {
    const formData: FormData = new FormData();
    const files: Array<File> = this.filesToUpload;

    for (let file of files) {
      formData.append('uploads[]', file, file.name);
    }

    this.isProcessing = true;
    return formData;
  }
}

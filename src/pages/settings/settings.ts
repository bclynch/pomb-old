// import { Component } from '@angular/core';


// @Component({
//   selector: 'page-settings',
//   templateUrl: 'settings.html'
// })
// export class SettingsPage {


//   constructor(

//   ) {  }

// }

import { ViewChild, Component, ElementRef } from '@angular/core';
import { AgmMap, AgmDataLayer } from '@agm/core';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { APIService } from '../../services/api.service';

import Chart from 'chart.js';

@Component({
 selector: 'page-settings',
 templateUrl: 'settings.html'
})
export class SettingsPage {
  @ViewChild('elevationTime') elevationTime: any;
  @ViewChild('elevationDistance') elevationDistance: any;
  @ViewChild('speedTime') speedTime: any;
  @ViewChild('speedDistance') speedDistance: any;

  lat: number = 37.662323;
  lng: number = -122.399451;
  zoom: number = 10;

  isProcessing: boolean = false;
  filesToUpload: Array<File> = [];

  geoJsonObject: Object = null;
  elevationTimeData: number[];
  elevationDistanceData: number[];
  speedTimeData: number[];
  speedDistanceData: number[];
 
  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private apiService: APIService
  ) {  
    this.settingsService.appInited ? console.log('neat') : this.broadcastService.on('appIsReady', () => console.log('neat'));
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

  createLineChart() {
    let elevationTimeCtx = this.elevationTime.nativeElement.getContext('2d');
    
    console.log(this.elevationTimeData);
    const mydata = {
      datasets: [{ 
          data: this.elevationTimeData,
          label: "Elevation",
          backgroundColor: 'rgba(255,133,0,0.2)',
          borderColor: 'rgba(255,133,0,1)',
          pointBackgroundColor: 'rgba(255,133,0,1)',
          pointBorderColor: 'rgba(255,133,0,1)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
      ]
    }; 
    const elevationTimeOptions = {
      title: {
        display: true,
        text: 'Elevation Profile'
      },
      // spanGaps: false,
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
          scaleLabel: {
            display: true,
            labelString: 'Elevation (m)'
          }
        }]
      },
      events: [],
      elements: {
        point:{
          radius: 0
        }
      }
    };

    var myLineChart = new Chart(elevationTimeCtx, {
      type: 'line',
      data: mydata,
      options: elevationTimeOptions
    });

    let speedCtx = this.speedTime.nativeElement.getContext('2d');
  
    const speeddata = {
      datasets: [{ 
          data: this.speedTimeData,
          label: "Speed",
          backgroundColor: 'rgba(255,133,0,0.2)',
          borderColor: 'rgba(255,133,0,1)',
          pointBackgroundColor: 'rgba(255,133,0,1)',
          pointBorderColor: 'rgba(255,133,0,1)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
      ]
    }; 
    const speedoptions = {
      title: {
        display: true,
        text: 'Speed Profile'
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
          scaleLabel: {
            display: true,
            labelString: 'Speed (km/h)'
          }
        }]
      },
      events: [],
      elements: {
        point:{
          radius: 0
        }
      }
    };

    var speedChart = new Chart(speedCtx, {
      type: 'line',
      data: speeddata,
      options: speedoptions
    });


    let elevationDistanceCtx = this.elevationDistance.nativeElement.getContext('2d');
    
    console.log(this.elevationDistanceData);
    const elevationDistanceData = {
      datasets: [{ 
          data: this.elevationDistanceData,
          label: "Elevation",
          backgroundColor: 'rgba(255,133,0,0.2)',
          borderColor: 'rgba(255,133,0,1)',
          pointBackgroundColor: 'rgba(255,133,0,1)',
          pointBorderColor: 'rgba(255,133,0,1)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
      ]
    }; 

    const elevationDistanceOptions = {
      title: {
        display: true,
        text: 'Elevation Profile'
      },
      // spanGaps: false,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Distance (kms)'
          },
          type: 'linear'
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Elevation (m)'
          }
        }]
      },
      events: [],
      elements: {
        point:{
          radius: 0
        },
        line: {
          tension: 0, // disables bezier curves
        }
      }
    };

    var elevationDistanceChart = new Chart(elevationDistanceCtx, {
      type: 'line',
      data: elevationDistanceData,
      options: elevationDistanceOptions
    });

    let speedDistanceCtx = this.speedDistance.nativeElement.getContext('2d');
  
    console.log(this.speedDistanceData);
    const speedDistanceData = {
      datasets: [{ 
          data: this.speedDistanceData,
          label: "Speed",
          backgroundColor: 'rgba(255,133,0,0.2)',
          borderColor: 'rgba(255,133,0,1)',
          pointBackgroundColor: 'rgba(255,133,0,1)',
          pointBorderColor: 'rgba(255,133,0,1)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
      ]
    };

    const speedDistanceOtions = {
      title: {
        display: true,
        text: 'Speed Profile'
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
          scaleLabel: {
            display: true,
            labelString: 'Speed (km/h)'
          }
        }]
      },
      events: [],
      elements: {
        point:{
          radius: 0
        },
        line: {
          tension: 0, // disables bezier curves
        }
      }
    };

    var speedDistanceChart = new Chart(speedDistanceCtx, {
      type: 'line',
      data: speedDistanceData,
      options: speedDistanceOtions
    });
  }

  fileChangeEvent(fileInput: any) {
      this.filesToUpload = <Array<File>>fileInput.target.files;
      const processedData = this.processFormData();

      this.apiService.uploadGPX(processedData).subscribe(
          result => {
            console.log(result);
            this.geoJsonObject = result.data.features[0];
            this.elevationTimeData = result.data.features[0].geometry.coordinates.map((coord, i) => { return { x: result.data.timeArr[i], y: coord[2] } });
            //reducing points on graph
            this.elevationTimeData = this.elevationTimeData.filter((_,i) => i % 15 == 0); 
            this.speedTimeData = result.data.features[0].speedsArr.map((speed, i) => { return { x: result.data.timeArr[i], y: speed } });
            //reducing points on graph
            this.speedTimeData = this.speedTimeData.filter((_,i) => i % 15 == 0); 
            this.elevationDistanceData = result.data.features[0].geometry.coordinates.map((coord, i) => { return { x: result.data.distanceArr[i] / 1000, y: coord[2] } });
            //reducing points on graph
            this.elevationDistanceData = this.elevationDistanceData.filter((_,i) => i % 15 == 0); 
            this.speedDistanceData = result.data.features[0].speedsArr.map((speed, i) => { return { x: result.data.distanceArr[i] / 1000, y: speed } });
            //reducing points on graph
            this.speedDistanceData = this.speedDistanceData.filter((_,i) => i % 15 == 0);
            this.createLineChart();
            this.isProcessing = false; 
          } 
        );
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
// import { Component } from '@angular/core';


// @Component({
//   selector: 'page-settings',
//   templateUrl: 'settings.html'
// })
// export class SettingsPage {


//   constructor(

//   ) {  }

// }

import { ViewChild, Component, ElementRef, AfterViewInit } from '@angular/core';
import { AgmMap, AgmDataLayer } from '@agm/core';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { APIService } from '../../services/api.service';

import Chart from 'chart.js';

@Component({
 selector: 'page-settings',
 templateUrl: 'settings.html'
})
export class SettingsPage implements AfterViewInit {
  @ViewChild('donut') donut: ElementRef;
  @ViewChild('line') line: ElementRef;

  lat: number = 37.662323;
  lng: number = -122.399451;
  zoom: number = 10;

  isProcessing: boolean = false;
  filesToUpload: Array<File> = [];

  geoJsonObject: Object = null;
  lineData: number[];

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private apiService: APIService
  ) {  
    this.settingsService.appInited ? console.log('neat') : this.broadcastService.on('appIsReady', () => console.log('neat'));
  }
 
  ngAfterViewInit() {
    let donutCtx = this.donut.nativeElement.getContext('2d');

    var data = {
      labels: [
        "Value A",
        "Value B"
      ],
      datasets: [
        {
          "data": [101342, 55342],   // Example data
          "backgroundColor": [
              "#1fc8f8",
              "#76a346"
          ]
        }
      ]
    };

    var chart = new Chart(
      donutCtx,
      {
        "type": 'doughnut',
        "data": data,
        "options": {
          "cutoutPercentage": 50,
          "animation": {
            "animateScale": true,
            "animateRotate": false
          }
        } 
      }
    );
    
    this.createLineChart();
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
    let lineCtx = this.line.nativeElement.getContext('2d');
    
    // const mydata = {
    //   labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
    //   datasets: [{ 
    //       data: this.lineData,
    //       label: "Africa",
    //       borderColor: "#3e95cd", 
    //       fill: false
    //     }
    //   ]
    // }; 
    const mydata = {
      labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
      datasets: [{ 
          data: [86,114,106,106,107,111,133,221,783,2478],
          label: "Africa",
          lineTension: 0,
          backgroundColor: 'rgba(255,133,0,0.2)',
          borderColor: 'rgba(255,133,0,1)',
          pointBackgroundColor: 'rgba(255,133,0,1)',
          pointBorderColor: 'rgba(255,133,0,1)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }, { 
          data: [282,350,411,502,635,809,947,1402,3700,5267],
          label: "Asia",
          borderColor: "#8e5ea2",
          fill: false
        }, { 
          data: [168,170,178,190,203,276,408,547,675,734],
          label: "Europe",
          borderColor: "#3cba9f",
          fill: false
        }, { 
          data: [40,20,10,16,24,38,74,167,508,784],
          label: "Latin America",
          borderColor: "#e8c3b9",
          fill: false
        }, { 
          data: [6,3,2,2,7,26,82,172,312,433],
          label: "North America",
          borderColor: "#c45850",
          fill: false
        }
      ]
    };
    const myoptions = {
      title: {
        display: true,
        text: 'World population per region (in millions)'
      },
      scales: {
        xAxes: [{
          ticks: {
            maxTicksLimit: 4
          }
        }]
      },
      elements: {
        point:{
          radius: 0
        }
      }
    };

    var myLineChart = new Chart(lineCtx, {
      type: 'line',
      data: mydata,
      options: myoptions
    });
  }

  fileChangeEvent(fileInput: any) {
      this.filesToUpload = <Array<File>>fileInput.target.files;
      const processedData = this.processFormData();

      this.apiService.uploadGPX(processedData).subscribe(
          result => {
            console.log(result);
            this.geoJsonObject = result.data.features[0];
            this.lineData = result.data.features[0].speedsArr;
            // this.createLineChart();
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
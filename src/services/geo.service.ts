import { Injectable } from '@angular/core';
import geolib, { PositionInTime } from 'geolib';

import { GeoJSON } from '../models/Geo.model';
import { UtilService } from '../services/util.service';
import { SettingsService } from '../services/settings.service';

@Injectable()
export class GeoService {

  private measures = {
    'm' : {value: 1},
    'km': {value: 0.001},
    'cm': {value: 100},
    'mm': {value: 1000},
    'mi': {value: (1 / 1609.344)},
    'sm': {value: (1 / 1852.216)},
    'ft': {value: (100 / 30.48)},
    'in': {value: (100 / 2.54)},
    'yd': {value: (1 / 0.9144)}
  };

  constructor(
    private utilService: UtilService,
    private settingsService: SettingsService
  ) {

  }

  generateGeoJSON(data): GeoJSON {
    const geoJSON: GeoJSON = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: []
      },
      properties: {
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

  crunchGPXData(geoJSON: GeoJSON) {
    const gpxData: any = { ...geoJSON };

    // calculate total distance + generate time arr
    const distanceObj = this.getTotalDistance(geoJSON.geometry.coordinates);
    console.log('TOTAL DISTANCE in kms: ', distanceObj.totalDistance / 1000);
    gpxData.totalDistance = distanceObj.totalDistance;
    gpxData.distanceArr = distanceObj.distanceArr;

    // calculate speed + generate time arr
    const speedsObj = this.getSpeedArr(geoJSON.geometry.coordinates, geoJSON.properties.coordTimes);
    gpxData.speedsArr = speedsObj.speedsArr;
    gpxData.timeArr = speedsObj.convertedTimeArr;

    // calculate statistics
    gpxData.stats = this.calculateStatistics(gpxData);

    return gpxData;
  }

  getSpeedArr(geoArr: number[][], timeArr: string[]): { speedsArr: number[]; convertedTimeArr: number[] } {
    const speedsArr = [];
    const convertedTimeArr = [];
    for (let i = 0; i < geoArr.length; i++) {
      if (i < geoArr.length - 1) {
        const timeToMs = Date.parse(timeArr[i]);
        convertedTimeArr.push(timeToMs);
        // there's an error in the d.ts typing file so created own function
        speedsArr.push(this.getSpeed(
          { lat: geoArr[i][1], lng: geoArr[i][0], time: timeToMs } as any,
          { lat: geoArr[i + 1][1], lng: geoArr[i + 1][0], time: Date.parse(timeArr[i + 1]) },
          { unit: this.settingsService.unitOfMeasure === 'metric' ? 'kph' : 'mph' }
        ));
      }
    }
    // copying the last elem and pushing to end of arr so it has same count as coord arr. Same for times
    speedsArr.splice(speedsArr.length - 1, 0, speedsArr[speedsArr.length - 1]);
    convertedTimeArr.splice(convertedTimeArr.length - 1, 0, convertedTimeArr[convertedTimeArr.length - 1]);

    return { speedsArr, convertedTimeArr };
  }

  // take in coord arr and find total distance
  getTotalDistance(arr): { totalDistance: number; distanceArr: number[] } {
    let totalDistance = 0;
    const distanceArr = [];

    for (let i = 0; i < arr.length; i++) {
      if (i < arr.length - 1) {
        const distance = geolib.getDistance(
          { latitude: arr[i][1], longitude: arr[i][0] },
          { latitude: arr[i + 1][1], longitude: arr[i + 1][0] }
        );

        totalDistance += this.settingsService.unitOfMeasure === 'metric' ? distance : this.utilService.metersToMiles(distance);
        distanceArr.push(totalDistance);
      }
    }
    // copying the last elem and pushing to end of arr so it has same count as coord arr.
    distanceArr.splice(distanceArr.length - 1, 0, distanceArr[distanceArr.length - 1]);

    return { totalDistance, distanceArr };
  }

  calculateStatistics(gpxData) {
    // desired stats: max speed, avg speed, duration, total climb, total descent
    const statsObj: any = {};

    // max speed
    statsObj.maxSpeed = Math.max.apply( Math, gpxData.speedsArr );

    // avg speed
    statsObj.avgSpeed = gpxData.speedsArr.reduce( ( p, c ) => p + c, 0 ) / gpxData.speedsArr.length;

    // duration
    statsObj.duration = gpxData.timeArr[gpxData.timeArr.length - 1] - gpxData.timeArr[0];

    // total climb + descent
    let climb = 0;
    let descent = 0;
    for (let i = 1; i < gpxData.geometry.coordinates.length; i++) {
      const difference = gpxData.geometry.coordinates[i][2] - gpxData.geometry.coordinates[i - 1][2];
      if (difference > 0) climb += difference;
      if (difference < 0) descent -= difference;
    }
    statsObj.climb = climb;
    statsObj.descent = descent;

    return statsObj;
  }

  private getSpeed(start, end, options: { unit: 'mph' | 'kph' }) {

    let unit = options && options.unit || 'km';

    if (unit === 'mph') {
        unit = 'mi';
    } else if (unit === 'kph') {
        unit = 'km';
    }

    const distance = geolib.getDistance(start, end);
    const time = ((end.time * 1) / 1000) - ((start.time * 1) / 1000);
    const mPerHr = (distance / time) * 3600;
    const speed = Math.round(mPerHr * this.measures[unit].value * 10000) / 10000;
    return speed;
  }
}

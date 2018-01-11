import { Injectable } from '@angular/core';
import geolib, { PositionInTime } from 'geolib';

@Injectable()
export class MappingService {

  constructor(

  ) {

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

  getSpeedArr(geoArr, timeArr) {
    const speedsArr: PositionInTime[] = [{latitude: 12, longitude: 12, time: 45}];
    const convertedTimeArr = [];
    for (let i = 0; i < geoArr.length; i++) {
      if (i < geoArr.length - 1) {
        const timeToMs = Date.parse(timeArr[i]);
        convertedTimeArr.push(timeToMs);
        speedsArr.push(geolib.getSpeed(
          { latitude: geoArr[i][1], longitude: geoArr[i][0], time: timeToMs },
          { lat: geoArr[i + 1][1], lng: geoArr[i + 1][0], time: Date.parse(timeArr[i + 1]) }
        ));
      }
    }
    // copying the last elem and pushing to end of arr so it has same count as coord arr. Same for times
    speedsArr.splice(speedsArr.length - 1, 0, speedsArr[speedsArr.length - 1]);
    convertedTimeArr.splice(convertedTimeArr.length - 1, 0, convertedTimeArr[convertedTimeArr.length - 1]);

    return speedsArr;
  }
}

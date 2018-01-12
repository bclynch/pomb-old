import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class UtilService {

  scrollDirection: 'up' | 'down' = 'up';
  displayExploreNav = false;

  constructor(
    private http: Http
  ) {

  }

  formatURLString(data: string): string {
    // format regions/countries pulled off the url to be upper case and spaced
    return data.split('-').map((elem) => {
      return elem.charAt(0).toUpperCase() + elem.slice(1);
    }).join(' ');
  }

  formatForURLString(data: string): string {
    // format regions/countries to be formatted for url
    return data.split(' ').join('-').toLowerCase();
  }

  getJSON(path: string) {
    return this.http.get(path).map((res: Response) => res.json());
  }

  msToTime(millisec: number): string {
    let seconds: any = (millisec / 1000).toFixed(0);
    let minutes: any = Math.floor(seconds / 60);
    let hours: any = '';
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = (hours >= 10) ? hours : '0' + hours;
        minutes = minutes - (hours * 60);
        minutes = (minutes >= 10) ? minutes : '0' + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : '0' + seconds;
    if (hours !== '') return hours + ':' + minutes + ':' + seconds;
    return minutes + ':' + seconds;
  }

  metersToMiles(meters: number): number {
    return meters * 0.000621371;
  }

  kmsToMiles(kms: number): number {
    return kms * 0.621371;
  }

  metersToFeet(meters: number): number {
    return meters * 3.28084;
  }
}

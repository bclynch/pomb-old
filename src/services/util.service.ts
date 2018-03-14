import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UtilService {

  scrollDirection: 'up' | 'down' = 'up';
  checkScrollInfinite = false;
  allFetched = false;
  displayExploreNav = false;

  private infiniteActiveSubject: BehaviorSubject<void>;
  public infiniteActive$: Observable<void>;
  public infiniteActive: boolean;

  constructor(
    private http: Http
  ) {
    this.infiniteActiveSubject = new BehaviorSubject(null);
    this.infiniteActive$ = this.infiniteActiveSubject.asObservable();
    this.infiniteActive = false;
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

  differenceDays(start: number, end: number): number {
    let timeDiff: number;
    if (end) {
      timeDiff = end - start;
    } else {
      timeDiff = Date.now() - start;
    }
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  stripHTMLTags(string: string): string {
    return string.replace(/<(?!\/>)[^>]*>/g, '').replace(/&#39;/g, '\'');
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

  toggleInfiniteActive(state: boolean) {
    this.infiniteActive = state;
    this.infiniteActiveSubject.next(null);
  }

  truncateString(str, num) {
    if (str.length > num) return str.slice(0, num > 3 ? num - 3 : num) + '...';
    return str;
  }

  extractCity(addressComponents): string {
    for (let i = 0; i < addressComponents.length; i++) {
      for ( let j = 0; j < addressComponents[i].types.length; j++) {
        const type = addressComponents[i].types[j];
        // as its going down the list of places it will git the most specific one first and return the value
        if (type === 'locality' || type === 'administrative_area_level_2' || type === 'administrative_area_level_1' || type === 'country') {
          return addressComponents[i].long_name;
        }
      }
    }
    return null;
  }
}

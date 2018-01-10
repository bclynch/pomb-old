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

  formatURLString(data: string) {
    // format regions/countries pulled off the url to be upper case and spaced
    return data.split('-').map((elem) => {
      return elem.charAt(0).toUpperCase() + elem.slice(1);
    }).join(' ');
  }

  formatForURLString(data: string) {
    // format regions/countries to be formatted for url
    return data.split(' ').join('-').toLowerCase();
  }

  getJSON(path: string) {
    return this.http.get(path).map((res: Response) => res.json());
  }
}

import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  scrollDirection: 'up' | 'down' = 'up';

  constructor(

  ) { 

  }

  formatURLString(data: string) {
    //format regions/countries pulled off the url to be upper case and spaced
    return data.split('-').map(function(elem){
      return elem.charAt(0).toUpperCase() + elem.slice(1);
    }).join(' ');
  }
}
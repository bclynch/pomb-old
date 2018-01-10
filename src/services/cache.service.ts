import { Injectable } from '@angular/core';

@Injectable()
export class CacheService {

  cache: any = {};

  constructor(

  ) {

  }

  addToCache(id: string, prop: string, data: any) {
    if (!this.cache[id]) {
      this.cache[id] = {};
    }
    this.cache[id][prop] = data;
  }

  checkCache(id: string, prop: string) {
    if (this.cache[id]) {
      return this.cache[id][prop];
    } else {
      this.cache[id] = {};
      return false;
    }
  }
}

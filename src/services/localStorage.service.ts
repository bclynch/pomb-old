import { Injectable } from '@angular/core';

@Injectable()

export class LocalStorageService {

  set(name: string, data: any): void {
    localStorage.setItem(name, JSON.stringify(data));
  }

  get(name: string) {
      const data = localStorage.getItem(name);
      return JSON.parse(data);
  }

  remove(name: string) {
    localStorage.removeItem(name);
  }

}

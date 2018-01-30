import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Title } from '@angular/platform-browser';

import { APIService } from './api.service';
import { ExploreService } from './explore.service';
import { LocalStorageService } from './localStorage.service';

import { Trip } from '../models/Trip.model';
import { Image } from '../models/Image.model';

interface FeaturedStory {
  id: number;
  title: string;
  subtitle: string;
  imgURL: string;
}

@Injectable()

export class SettingsService {

  appInited = false;
  primaryColor: string;
  secondaryColor: string;
  tagline: string;
  heroBanner: string;
  featuredStories: FeaturedStory[];
  featuredTrip: Trip;
  recentPhotos: Image[];

  private unitOfMeasureSubject: BehaviorSubject<void>;
  public unitOfMeasure$: Observable<void>;
  public unitOfMeasure: 'imperial' | 'metric';

  siteSections = {
    'Community': { subSections: ['Community Hub', 'Featured Trip'] },
    'Stories': { subSections: ['trekking', 'biking', 'travel', 'culture', 'gear', 'food'] },
    'My Pack': { subSections: ['Create Trip', 'Create Juncture', 'Blog Dashboard', 'User Dashboard'] }
  };

  constructor(
    private apiService: APIService,
    private exploreService: ExploreService,
    private localStorageService: LocalStorageService,
    private titleService: Title
  ) {
    this.unitOfMeasureSubject = new BehaviorSubject(null);
    this.unitOfMeasure$ = this.unitOfMeasureSubject.asObservable();
    this.unitOfMeasure = 'imperial';
  }

  appInit() {
    const promises = [];

    // check local storage for unit of measure
    const unitType = this.localStorageService.get('unitOfMeasure');
    if (unitType) {
      this.changeUnitOfMeasure(unitType);
    } else {
      this.localStorageService.set('unitOfMeasure', this.unitOfMeasure);
    }

    // countries data
    promises.push(this.exploreService.init());

    const promise2 = new Promise<string>((resolve, reject) => {
      this.apiService.getConfig().valueChanges.subscribe(
        data => {
          const appSettings = data.data.allConfigs.nodes[0];
          console.log(appSettings);
          this.primaryColor = appSettings.primaryColor;
          this.secondaryColor = appSettings.secondaryColor;
          this.tagline = appSettings.tagline;
          this.heroBanner = appSettings.heroBanner;
          this.featuredTrip = appSettings.tripByFeaturedTrip1;
          this.addFeaturedStory([appSettings.postByFeaturedStory1, appSettings.postByFeaturedStory2, appSettings.postByFeaturedStory3]);

          // get photos for nav
          this.apiService.getRecentImages(5).valueChanges.subscribe(
            result => {
              this.recentPhotos = result.data.allImages.nodes;
              resolve();
            }
          );
        },
        err => reject(err)
      );
    });
    promises.push(promise2);

    return Promise.all(promises);
  }

  changeUnitOfMeasure(unitType: 'imperial' | 'metric') {
    this.unitOfMeasure = unitType;
    this.unitOfMeasureSubject.next(null);
  }

  addFeaturedStory(stories: any[]) {
    this.featuredStories = stories.map((story) => {
      return { id: story.id, title: story.title, subtitle: story.subtitle, imgURL: story.imagesByPostId.nodes[0].url };
    });
  }

  modPageTitle(title: string) {
    this.titleService.setTitle(`POMB - ${title}`);
  }
}

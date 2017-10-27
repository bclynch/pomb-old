import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'ExploreModal',
  templateUrl: 'exploreModal.html'
})
export class ExploreModal {

  modalData;

  constructor(
    public viewCtrl: ViewController,
    private apiService: APIService,
    private params: NavParams,
    private settingsService: SettingsService,
    private utilService: UtilService,
    private sanitizer: DomSanitizer,
    private routerService: RouterService
  ) {
    this.modalData = this.params.data.data.map((section) => {
      return {
        label: section.label,
        top: section.items.slice(0, 3).map((place) => { return { label: place, img: null }}),
        other: section.items.slice(3)
      }
    });

    //fetch imgs for 'top' content
    this.modalData.forEach((section, sectionIndex) => {
      section.top.forEach((place, placeIndex) => {
        //grab flickr images for the modal
        this.apiService.getFlickrPhotos(this.utilService.formatURLString(place.label), 'landscape').subscribe(
          result => {
            console.log(result.photos.photo);
            const photo = result.photos.photo[0];
            //using square photo size 75 x 75
            this.modalData[sectionIndex].top[placeIndex].img = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_s.jpg`
          }
        )
      });
    });
  }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  navigate(place: string, type: string) {
    switch(type) {
      case 'Popular Regions':
        this.routerService.navigateToPage(`/explore/region/${this.utilService.formatForURLString(place)}`);
        break;
      case 'Popular Countries':
        this.routerService.navigateToPage(`/explore/country/${this.utilService.formatForURLString(place)}`);
        break;
      case 'Popular Cities':

        break;
    }

    this.viewCtrl.dismiss();
  }
}

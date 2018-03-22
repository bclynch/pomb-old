import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { SettingsService } from '../../../services/settings.service';
import { RouterService } from '../../../services/router.service';

import { GalleryPhoto } from '../../../models/GalleryPhoto.model';

@Component({
  selector: 'ExpandedModal',
  templateUrl: 'expandedModal.component.html'
})
export class ExpandedModal {

  photos: GalleryPhoto[];
  currentIndex: number;
  tempPanStart: number;

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams,
    private settingsService: SettingsService,
    private routerService: RouterService
  ) {
    this.photos = this.params.data.data;
    this.currentIndex = this.params.data.index;
  }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  pan(direction: string) {
    if (direction === 'forward') {
      if (this.currentIndex !== this.photos.length - 1) this.currentIndex++;
    } else {
      if (this.currentIndex !== 0) this.currentIndex--;
    }
  }

  panStart(e) {
    this.tempPanStart = e.center.x;
  }

  panGesture(e, type) {
    if (this.tempPanStart) {
      console.log(e.distance);
      if (type === 'right') {
        if (e.distance > 200) {
          this.pan('forward');
          this.tempPanStart = null;
        }
      } else {
        if (e.distance > 200) {
          this.pan('back');
          this.tempPanStart = null;
        }
      }
    }
  }

  onKey(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 39:
        if (this.currentIndex !== this.photos.length - 1) this.currentIndex++;
        break;
      case 37:
        if (this.currentIndex !== 0) this.currentIndex--;
        break;
    }
  }

  goToUser(user: string) {
    this.viewCtrl.dismiss();
    this.routerService.navigateToPage(`/user/${user}`);
  }
}

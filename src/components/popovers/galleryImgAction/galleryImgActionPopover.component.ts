import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { GalleryPhoto } from '../../../models/GalleryPhoto.model';

@Component({
  selector: 'GalleryImgActionPopover',
  templateUrl: 'galleryImgActionPopover.component.html'
})
export class GalleryImgActionPopover {

  popoverModel: GalleryPhoto;

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams
  ) {
    this.popoverModel = { ...params.get('model') };
  }

  dismissPopover(action: string) {
    const data = { action, data: this.popoverModel };
    this.viewCtrl.dismiss(data);
  }
}

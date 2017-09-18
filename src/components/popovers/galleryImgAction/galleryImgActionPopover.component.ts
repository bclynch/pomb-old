import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'GalleryImgActionPopover',
  templateUrl: 'galleryImgActionPopover.component.html'
})
export class GalleryImgActionPopover {

  // options;
  popoverModel;

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams
  ) {
    // this.options = params.get('options');
  }
 
  // selectOption(option: string) {
  //   this.viewCtrl.dismiss(option);
  // }

  dismissPopover(action: string) {
    const data = { action, data: this.popoverModel };
    this.viewCtrl.dismiss(data);
  }
}
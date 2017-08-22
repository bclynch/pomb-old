import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'PostTypePopover',
  templateUrl: 'postTypePopover.component.html'
})
export class PostTypePopover {

  options;

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams
  ) {
    this.options = params.get('options');
  }
 
  selectOption(option: string) {
    this.viewCtrl.dismiss(option);
  }
}
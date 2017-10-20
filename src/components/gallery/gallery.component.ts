import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { GalleryPhoto } from '../../models/GalleryPhoto.model';
import { ExpandedModal } from './expandedModal/expandedModal.component';

@Component({
  selector: 'Gallery',
  templateUrl: 'gallery.component.html'
})
export class Gallery {
  @Input() data: GalleryPhoto[];
  @Input() gutterWidth: string = '5px';
  @Input() perRow: number;
  @Input() isSquare: boolean = false;

  constructor(
    private modalController: ModalController
  ) { }

  expandCarousel(i: number) {
    let modal = this.modalController.create(ExpandedModal, { data: this.data, index: i }, { cssClass: 'expandedModal' });
    modal.present();
  }
}

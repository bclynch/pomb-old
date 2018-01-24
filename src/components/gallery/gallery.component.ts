import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { GalleryPhoto } from '../../models/GalleryPhoto.model';
import { ExpandedModal } from './expandedModal/expandedModal.component';

@Component({
  selector: 'Gallery',
  templateUrl: 'gallery.component.html'
})
export class Gallery {
  @Input() data: GalleryPhoto[];
  @Input() gutterWidth = '5px';
  @Input() perRow: number;
  @Input() isSquare = false;

  constructor(
    private modalController: ModalController
  ) { }

  expandCarousel(i: number) {
    const modal = this.modalController.create(ExpandedModal, { data: this.data, index: i }, { cssClass: 'expandedModal' });
    modal.present();
  }
}

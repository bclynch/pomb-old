import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from 'ionic-angular';

import { ExpandedModal } from '../gallery/expandedModal/expandedModal.component';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'Grid',
  templateUrl: 'grid.component.html'
})
export class Grid {
  @Input() gridConfig: number[];
  @Input() elements = [];
  @Input() isPost = true;

  constructor(
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
    private modalController: ModalController
  ) { }

  openCarousel(i: number) {
    const modal = this.modalController.create(ExpandedModal, { data: this.settingsService.recentPhotos, index: i }, { cssClass: 'expandedModal' });
    modal.present();
  }
}

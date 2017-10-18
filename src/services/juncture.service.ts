import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { JunctureModal } from '../components/modals/junctureModal/junctureModal';

@Injectable()
export class JunctureService {

  constructor(
    private modalCtrl: ModalController
  ) { }

  createJuncture() {
    let modal = this.modalCtrl.create(JunctureModal, {}, {cssClass: 'junctureModal'});
    modal.onDidDismiss(data => {
      //toast maybe if successfull
    });
    modal.present(); 


  }
}
import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';

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
    private settingsService: SettingsService
  ) {
    this.modalData = this.params.data.data;
  }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }
}

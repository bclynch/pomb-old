import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ViewController, NavParams, PopoverController, ModalController, ToastController } from 'ionic-angular';

import { APIService } from '../../../services/api.service';
import { UserService } from '../../../services/user.service';
import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { AlertService } from '../../../services/alert.service';

import { DatePickerModal } from '../datepickerModal/datepickerModal';
import { ImageUploaderPopover } from '../../popovers/imageUploader/imageUploaderPopover.component';

@Component({
  selector: 'TripModal',
  templateUrl: 'tripModal.html'
})
export class TripModal {

  tripModel = {name: '', timeStart: Date.now(), timeEnd: null, description: ''};
  defaultPath: string = '../../../assets/images/trip-default.jpg';

  constructor(
    public viewCtrl: ViewController,
    private apiService: APIService,
    private userService: UserService,
    private params: NavParams,
    private router: Router,
    private settingsService: SettingsService,
    private utilService: UtilService,
    private popoverCtrl: PopoverController,
    private alertService: AlertService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {

  }

  presentDatepickerModal(e: Event, isStart) {
    e.stopPropagation();

    let modal = this.modalCtrl.create(DatePickerModal, { date: isStart ? this.tripModel.timeStart : this.tripModel.timeEnd || Date.now() }, {});
    modal.present({
      ev: e
    });
    modal.onDidDismiss((data: any) => {
      console.log(Date.parse(data));
      if (data) {
        if(isStart) {
          this.tripModel.timeStart = Date.parse(data);
        } else {
          this.tripModel.timeEnd = Date.parse(data);
        }
      }
    });
  }

  saveTrip() {
    // this.viewCtrl.dismiss({
    //   saveType: this.junctureSaveType,
    //   name: this.junctureModel.name,
    //   description: this.junctureModel.description,
    //   photos: this.galleryPhotos,
    //   time: this.junctureModel.time,
    //   location: this.coords
    // });
  }

  presentBannerUploaderPopover() {
    let popover = this.popoverCtrl.create(ImageUploaderPopover, { type: 'tripBanner' }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
    popover.present();
    popover.onDidDismiss((data) => {
      if(data) {
        // data.forEach((img) => {
        //   this.galleryPhotos.push({
        //     id: null,
        //     photoUrl: img.url,
        //     description: ''
        //   })
        // });
      }
    });
  }
}

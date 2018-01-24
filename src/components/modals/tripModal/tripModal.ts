import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ViewController, NavParams, PopoverController, ModalController, ToastController } from 'ionic-angular';

import { APIService } from '../../../services/api.service';
import { UserService } from '../../../services/user.service';
import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { AlertService } from '../../../services/alert.service';
import { JunctureService } from '../../../services/juncture.service';

import { DatePickerModal } from '../datepickerModal/datepickerModal';
import { ImageUploaderPopover } from '../../popovers/imageUploader/imageUploaderPopover.component';

@Component({
  selector: 'TripModal',
  templateUrl: 'tripModal.html'
})
export class TripModal {

  tripModel = {name: '', timeStart: Date.now(), timeEnd: null, bannerImages: null};

  inited = false;
  coords = { lat: null, lon: null };
  mapStyle;
  zoomLevel = 12;

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
    private toastCtrl: ToastController,
    private junctureService: JunctureService
  ) {
    // grab location for map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location: any) => {
        console.log(location.coords);
        this.coords.lat = location.coords.latitude;
        this.coords.lon = location.coords.longitude;
        // grab map style
        this.utilService.getJSON('../../assets/mapStyles/unsaturated.json').subscribe((data) => {
          this.mapStyle = data;
          this.inited = true;
        });
      });
    }
  }

  presentDatepickerModal(e: Event, isStart) {
    e.stopPropagation();

    const modal = this.modalCtrl.create(DatePickerModal, { date: isStart ? this.tripModel.timeStart : this.tripModel.timeEnd || Date.now() }, {});
    modal.present({
      ev: e
    });
    modal.onDidDismiss((data: any) => {
      if (data) {
        if (isStart) {
          this.tripModel.timeStart = Date.parse(data);
        } else {
          this.tripModel.timeEnd = Date.parse(data);
        }
      }
    });
  }

  saveTrip() {
    this.viewCtrl.dismiss({
      name: this.tripModel.name,
      timeStart: this.tripModel.timeStart,
      timeEnd: this.tripModel.timeEnd,
      bannerImages: this.tripModel.bannerImages,
      startLat: this.coords.lat,
      startLon: this.coords.lon
    });
  }

  presentBannerUploaderPopover() {
    const popover = this.popoverCtrl.create(ImageUploaderPopover, { type: 'banner', max: 5, size: { width: 3200, height: 2132 } }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
    popover.present();
    popover.onDidDismiss((data) => {
      if (data) {
        console.log(data);
        this.tripModel.bannerImages = data.map((img) => {
          return { url: img.url, title: null };
        });
      }
    });
  }

  moveCenter(e) {
    this.coords.lat = e.lat;
    this.coords.lon = e.lng;
  }
}

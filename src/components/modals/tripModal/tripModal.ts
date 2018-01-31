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
import { GalleryImgActionPopover } from '../../popovers/galleryImgAction/galleryImgActionPopover.component';

@Component({
  selector: 'TripModal',
  templateUrl: 'tripModal.html'
})
export class TripModal {

  editorOptions = {
    placeholderText: 'Write something insightful...',
    heightMin: '300px',
    heightMax: '525px',
    toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', '|', 'fontFamily', 'fontSize', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'indent', '|', 'specialCharacters', 'selectAll', 'clearFormatting', 'html', '|', 'undo', 'redo']
  };
  tripModel = {name: '', timeStart: Date.now(), timeEnd: null, description: '', bannerImages: []};

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

    const modal = this.modalCtrl.create(DatePickerModal, { date: isStart ? this.tripModel.timeStart : this.tripModel.timeEnd || Date.now() }, { cssClass: 'datepickerModal' });
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
      startLon: this.coords.lon,
      description: this.tripModel.description
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

  presentEditPopover(e, index: number) {
    console.log(index);
    e.stopPropagation();

    const self = this;
    const popover = this.popoverCtrl.create(GalleryImgActionPopover, { model: this.tripModel.bannerImages[index] }, { cssClass: 'galleryImgActionPopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      console.log(data);
      if (data) {
        if (data.action === 'delete') {
          this.alertService.confirm(
            'Delete Banner Image',
            'Are you sure you want to delete permanently delete this image?',
            { label: 'Delete', handler: () =>  {
              // if photo has already been saved to db
              if (this.tripModel.bannerImages[index].id) {
                this.apiService.deleteImageById(this.tripModel.bannerImages[index].id).subscribe(
                  result => {
                    this.tripModel.bannerImages.splice(index, 1);
                    toastDelete();
                  }
                );
              } else {
                this.tripModel.bannerImages.splice(index, 1);
                toastDelete();
              }
            }}
          );
        } else {
          // update photo
          this.tripModel.bannerImages[index].url = data.data.url;
          this.tripModel.bannerImages[index].title = data.data.description;
          this.tripModel.bannerImages[index].description = data.data.description;
        }
      }
    });

    function toastDelete() {
      const toast = self.toastCtrl.create({
        message: `Banner image deleted`,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }
}

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

import { Trip } from '../../../models/Trip.model';

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
  tripModel = { name: '', timeStart: Date.now(), timeEnd: null, description: '', bannerImages: [], photoHasChanged: [] };

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
    // grab existing trip if it exists
    if (this.params.data.tripId) {
      this.apiService.getTripById(this.params.data.tripId, this.userService.user.id).valueChanges.subscribe(
        result => {
          // console.log(result);
          const tripData: Trip = result.data.tripById;
          // populate model
          this.tripModel.name = tripData.name;
          this.tripModel.timeStart = +tripData.startDate;
          this.tripModel.timeEnd = tripData.endDate ? +tripData.endDate : null;
          this.tripModel.description = tripData.description;
          this.tripModel.bannerImages = tripData.imagesByTripId.nodes;
          this.coords.lat = +tripData.startLat;
          this.coords.lon = +tripData.startLon;
          this.grabMapStyle();
        }
      );
    } else {
      // grab location for map
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((location: any) => {
          this.coords.lat = location.coords.latitude;
          this.coords.lon = location.coords.longitude;
          this.grabMapStyle();
        });
      }
    }
  }

  grabMapStyle() {
    this.utilService.getJSON('../../assets/mapStyles/unsaturated.json').subscribe((data) => {
      this.mapStyle = data;
      this.inited = true;
    });
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
    if (!this.tripModel.name) {
      this.alertService.alert('Missing Information', 'Please enter a name for your trip and try to save again.');
    } else if (this.tripModel.timeEnd && this.tripModel.timeEnd < this.tripModel.timeStart) {
      this.alertService.alert('Save Issue', 'Please check your start and end dates. End date cannot be after your start date.');
    } else {
      this.viewCtrl.dismiss({
        isExisting: this.params.data.tripId ? true : false,
        name: this.tripModel.name,
        timeStart: this.tripModel.timeStart,
        timeEnd: this.tripModel.timeEnd,
        bannerImages: this.tripModel.bannerImages,
        startLat: this.coords.lat,
        startLon: this.coords.lon,
        description: this.tripModel.description,
        photoHasChanged: this.tripModel.photoHasChanged
      });
    }
  }

  presentBannerUploaderPopover() {
    const popover = this.popoverCtrl.create(ImageUploaderPopover, { type: 'banner', max: 5, size: { width: 3200, height: 2132 } }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
    popover.present();
    popover.onDidDismiss((data) => {
      if (data) {
        this.tripModel.bannerImages = data.map((img) => {
          return { id: null, url: img.url, title: null };
        });
      }
    });
  }

  moveCenter(e) {
    this.coords.lat = e.lat;
    this.coords.lon = e.lng;
  }

  presentEditPopover(e, index: number) {
    e.stopPropagation();

    const popover = this.popoverCtrl.create(GalleryImgActionPopover, { model: this.tripModel.bannerImages[index] }, { cssClass: 'galleryImgActionPopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      if (data) {
        if (data.action === 'delete') {
          this.alertService.confirm(
            'Delete Banner Image',
            'Are you sure you want to delete permanently delete this image?',
            { label: 'Delete', handler: () =>  {
              // if photo has already been saved to db
              if (this.tripModel.bannerImages[index].id) {
                this.tripModel.bannerImages = [...this.tripModel.bannerImages];
                this.apiService.deleteImageById(this.tripModel.bannerImages[index].id).subscribe(
                  result => {
                    this.tripModel.bannerImages.splice(index, 1);
                    this.toastDelete('Banner image deleted');
                  }
                );
              } else {
                this.tripModel.bannerImages.splice(index, 1);
                this.toastDelete('Banner image deleted');
              }
            }}
          );
        } else {
          // update photo
          const editedPhoto = {...this.tripModel.bannerImages[index]};
          editedPhoto.description = data.data.description;

          this.tripModel.photoHasChanged.push(editedPhoto);
        }
      }
    });
  }

  deleteTrip() {
    this.alertService.confirm(
      'Delete Trip',
      'Are you sure you want to delete this trip? All the associated information will be deleted and this action cannot be reversed',
      { label: 'Delete Trip', handler: () =>  {
        this.apiService.deleteTripById(this.params.data.tripId, this.userService.user.id).subscribe(
          result => {
            this.toastDelete('Trip deleted');
            this.viewCtrl.dismiss();
          }
        );
      }}
    );
  }

  toastDelete(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}

import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ViewController, NavParams, PopoverController, ModalController, ToastController } from 'ionic-angular';
import { MapsAPILoader } from '@agm/core';
import moment from 'moment';

import { APIService } from '../../../services/api.service';
import { UserService } from '../../../services/user.service';
import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { AlertService } from '../../../services/alert.service';

import { GalleryPhoto } from '../../../models/GalleryPhoto.model';

import { JunctureSaveTypePopover } from '../../popovers/junctureSaveType/junctureSaveTypePopover.component';
import { DatePickerModal } from '../datepickerModal/datepickerModal';
import { ImageUploaderPopover } from '../../popovers/imageUploader/imageUploaderPopover.component';
import { GalleryImgActionPopover } from '../../popovers/galleryImgAction/galleryImgActionPopover.component';

@Component({
  selector: 'JunctureModal',
  templateUrl: 'junctureModal.html'
})
export class JunctureModal {

  junctureModel = {name: 'Juncture ' + moment().format("l"), time: Date.now(), description: ''};
  inited = false;
  junctureSaveType: string = 'Draft';
  activeTimeOption: string = 'current';

  galleryPhotos: GalleryPhoto[] = [];

  coords = { lat: null, lon: null };
  mapStyle;
  zoomLevel: number = 12;

  constructor(
    public viewCtrl: ViewController,
    private apiService: APIService,
    private userService: UserService,
    private params: NavParams,
    private router: Router,
    private settingsService: SettingsService,
    private mapsAPILoader: MapsAPILoader,
    private utilService: UtilService,
    private popoverCtrl: PopoverController,
    private alertService: AlertService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((location: any) => {
        console.log(location.coords);
        this.coords.lat = location.coords.latitude;
        this.coords.lon = location.coords.longitude;
        //grab map style
        this.utilService.getJSON('../../assets/mapStyles/unsaturated.json').subscribe((data) => {
          this.mapStyle = data;
          this.inited = true;
        });
      });
    }
  }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  presentPopover(e) {
    let popover = this.popoverCtrl.create(JunctureSaveTypePopover, { options: ['Draft', 'Publish'] }, { cssClass: 'junctureSaveTypePopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      if(data) this.junctureSaveType = data;
    });
  }

  presentDatepickerModal(e: Event) {
    e.stopPropagation();

    if(this.activeTimeOption === 'custom') {
      let modal = this.modalCtrl.create(DatePickerModal, { date: this.junctureModel.time }, {});
      modal.present({
        ev: e
      });
      modal.onDidDismiss((data: any) => {
        console.log(Date.parse(data));
        if (data) {
          this.junctureModel.time = Date.parse(data);
        }
      });
    } 
  }

  toggleTimeOption(type: string) {
    if(type === 'current') this.junctureModel.time = Date.now();
    this.activeTimeOption = type;
  }

  presentGalleryUploaderPopover() {
    if(this.galleryPhotos.length === 6) {
      this.alertService.alert('Gallery Full', 'Only 6 images per juncture gallery maximum. Please delete a few to add more.')
    } else {
      let popover = this.popoverCtrl.create(ImageUploaderPopover, { type: 'gallery', existingPhotos: this.galleryPhotos.length, max: 6 }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
      popover.present();
      popover.onDidDismiss((data) => {
        if(data) {
          if(data === 'maxErr') {
            this.alertService.alert('Gallery Max Exceeded', 'Please reduce the number of images in the gallery to 6 or less');
          } else {
            data.forEach((img) => {
              this.galleryPhotos.push({
                id: null,
                photoUrl: img.url,
                description: ''
              })
            });
          }
        }
      });
    }
  }

  presentGalleryPopover(e, index: number) {
    const self = this;
    let popover = this.popoverCtrl.create(GalleryImgActionPopover, { model: this.galleryPhotos[index] }, { cssClass: 'galleryImgActionPopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      if(data) {
        if(data.action === 'delete') {
          this.alertService.confirm(
            'Delete Gallery Image', 
            'Are you sure you want to delete permanently delete this image?', 
            { label: 'Delete', handler: () =>  {
              //if photo has already been saved to db
              if(this.galleryPhotos[index].id) {
                this.apiService.deletePostToGalleryPhotoById(this.galleryPhotos[index].id).subscribe(
                  result => {
                    this.galleryPhotos.splice(index, 1);
                    toastDelete();
                  }
                );
              } else {
                this.galleryPhotos.splice(index, 1);
                toastDelete();
              }
            }}
          );
        } else {
          //update photo
          this.galleryPhotos[index] = data.data;
          //this.galleryItemHasChanged.push(this.galleryPhotos[index]);
        }
      }
    });

    function toastDelete() {
      let toast = self.toastCtrl.create({
        message: `Gallery image deleted`,
        duration: 3000,
        position: 'top'
      }); 
  
      toast.present();
    }
  }

  saveJuncture() {
    this.viewCtrl.dismiss({
      saveType: this.junctureSaveType,
      name: this.junctureModel.name,
      description: this.junctureModel.description,
      photos: this.galleryPhotos,
      time: this.junctureModel.time,
      location: this.coords
    });
  }

moveCenter(e) {
  this.coords.lat = e.lat;
  this.coords.lon = e.lng;
}
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewController, NavParams, PopoverController } from 'ionic-angular';
import { MapsAPILoader, AgmMap } from '@agm/core';

import { APIService } from '../../../services/api.service';
import { UserService } from '../../../services/user.service';
import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { AlertService } from '../../../services/alert.service';

import { GalleryPhoto } from '../../../models/GalleryPhoto.model';

import { JunctureSaveTypePopover } from '../../popovers/junctureSaveType/junctureSaveTypePopover.component';
import { DatePickerModal } from '../datepickerModal/datepickerModal';
import { ImageUploaderPopover } from '../../popovers/imageUploader/imageUploaderPopover.component';

@Component({
  selector: 'JunctureModal',
  templateUrl: 'junctureModal.html'
})
export class JunctureModal {
  registrationModel = {username: '', firstName: '', lastName: '', email: '', password: '', confirm: ''};
  loginModel = {email: '', password: ''};
  inited = false;
  junctureSaveType: string = 'Draft';

  formModel = { time: null } 

  timeOptions = [
    { label: 'Use Current Time', value: 'current' },
    { label: 'Use Custom Time', value: 'custom' }
  ]

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
    private alertService: AlertService
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

  submit() {
    console.log(this.formModel);
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

    // if (this.postOptions[this.activePostOption].name !== 'Draft') {
    //   let modal = this.modalController.create(DatePickerModal, { date: this.postOptions[this.activePostOption].name === 'Scheduled' ? this.scheduledModel.value : this.publishModel.value }, {});
    //   modal.present({
    //     ev: e
    //   });
    //   modal.onDidDismiss((data: any) => {
    //     console.log(Date.parse(data));
    //     if (data) {
    //       if (this.postOptions[this.activePostOption].name === 'Scheduled') {
    //         this.scheduledModel.label = moment(data).fromNow();
    //         this.scheduledModel.value = Date.parse(data);
    //       } else {
    //         this.publishModel.label = moment(data).fromNow();
    //         this.publishModel.value = Date.parse(data);
    //       }
    //     }
    //   });
    // }
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
}

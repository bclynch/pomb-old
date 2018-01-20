import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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

  junctureId: number;
  junctureModel = {name: 'Juncture ' + moment().format('l'), time: Date.now(), description: '', selectedTrip: null};
  inited = false;
  junctureSaveType = 'Publish';
  tripOptions = null;
  geoJsonObject: Object = null;

  galleryPhotos: GalleryPhoto[] = [];
  markerURL: string = null;
  startMarkerURL: string;

  coords = { lat: null, lon: null };
  mapStyle;
  zoomLevel = 12;
  dataLayerStyle;
  latlngBounds;
  gpxLoaded = false;

  tabBtns = ['Upload GPX', 'Manual'];
  selectedIndex = 0;

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
    private toastCtrl: ToastController,
    private sanitizer: DomSanitizer
  ) {
    // create juncture so we have an ID for gpx upload
    this.apiService.createJuncture().subscribe(
      (data: any) => {
        console.log('NEW JUNCTURE ID: ', data.data.createJuncture.juncture.id);
        this.junctureId = data.data.createJuncture.juncture.id;
      }
    );

    // grab trips to populate select
    this.apiService.tripsByUserId(this.userService.user.id).valueChanges.subscribe(
      (data: any) => {
        console.log(data);
        this.tripOptions = data.data.allUserToTrips.nodes;
        if (data.data.allUserToTrips.nodes[0]) this.junctureModel.selectedTrip = data.data.allUserToTrips.nodes[0].id;
      }
    );

    this.dataLayerStyle = {
      clickable: false,
      strokeColor: this.settingsService.secondaryColor,
      strokeWeight: 3
    };

    this.markerURL = this.params.data.markerImg;

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

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  onGPXUploaded(gpxData) {
    this.gpxLoaded = false;
    console.log('GPX Data: ', gpxData);

    this.mapsAPILoader.load().then(() => {
      this.latlngBounds = new window['google'].maps.LatLngBounds();
      // take five coord pairs from the coords arr evenly spaced to hopefully encapsulate all the bounds
      const chosenCoords = [];
      const desiredNumberPairs = 5;
      for (let i = 0; i < gpxData.geometry.coordinates.length && chosenCoords.length < desiredNumberPairs; i += Math.ceil(gpxData.geometry.coordinates.length / desiredNumberPairs)) {
        chosenCoords.push(gpxData.geometry.coordinates[i]);
      }

      chosenCoords.forEach((dataSet) => {
        this.latlngBounds.extend(new window['google'].maps.LatLng(dataSet[1], dataSet[0]));
      });

      this.coords.lat = gpxData.geometry.coordinates.slice(-1)[0][1];
      this.coords.lon = gpxData.geometry.coordinates.slice(-1)[0][0];
      this.geoJsonObject = gpxData;
      this.gpxLoaded = true;
    });
  }

  presentPopover(e) {
    const popover = this.popoverCtrl.create(JunctureSaveTypePopover, { options: ['Draft', 'Publish'] }, { cssClass: 'junctureSaveTypePopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      if (data) this.junctureSaveType = data;
    });
  }

  presentDatepickerModal(e: Event) {
    e.stopPropagation();

    const modal = this.modalCtrl.create(DatePickerModal, { date: this.junctureModel.time }, { cssClass: 'datepickerModal' });
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

  presentGalleryUploaderPopover() {
    if (this.galleryPhotos.length === 6) {
      this.alertService.alert('Gallery Full', 'Only 6 images per juncture gallery maximum. Please delete a few to add more.');
    } else {
      // type is gallery as of original
      const popover = this.popoverCtrl.create(ImageUploaderPopover, { type: 'juncture', existingPhotos: this.galleryPhotos.length, max: 6 }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
      popover.present();
      popover.onDidDismiss((data) => {
        if (data) {
          if (data === 'maxErr') {
            this.alertService.alert('Gallery Max Exceeded', 'Please reduce the number of images in the gallery to 6 or less');
          } else {
            data.forEach((img) => {
              if (img.size === 'marker') {
                this.markerURL = img.url;
              } else {
                this.galleryPhotos.push({
                  id: null,
                  photoUrl: img.url,
                  description: ''
                });
              }
            });
          }
        }
      });
    }
  }

  presentGalleryPopover(e, index: number) {
    const self = this;
    const popover = this.popoverCtrl.create(GalleryImgActionPopover, { model: this.galleryPhotos[index] }, { cssClass: 'galleryImgActionPopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      if (data) {
        if (data.action === 'delete') {
          this.alertService.confirm(
            'Delete Gallery Image',
            'Are you sure you want to delete permanently delete this image?',
            { label: 'Delete', handler: () =>  {
              // if photo has already been saved to db
              if (this.galleryPhotos[index].id) {
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
          // update photo
          this.galleryPhotos[index] = data.data;
          // this.galleryItemHasChanged.push(this.galleryPhotos[index]);
        }
      }
    });

    function toastDelete() {
      const toast = self.toastCtrl.create({
        message: `Gallery image deleted`,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

  saveJuncture() {
    this.viewCtrl.dismiss({
      junctureId: this.junctureId,
      saveType: this.junctureSaveType,
      name: this.junctureModel.name,
      description: this.junctureModel.description,
      photos: this.galleryPhotos,
      time: this.junctureModel.time,
      location: this.coords,
      selectedTrip: this.junctureModel.selectedTrip,
      markerImg: this.markerURL
    });
  }

  moveCenter(e) {
    this.coords.lat = e.lat;
    this.coords.lon = e.lng;
  }
}

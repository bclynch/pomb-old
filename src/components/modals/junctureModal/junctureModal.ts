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
import { GeoService } from '../../../services/geo.service';

import { Juncture } from '../../../models/Juncture.model';

import { JunctureSaveTypePopover } from '../../popovers/junctureSaveType/junctureSaveTypePopover.component';
import { DatePickerModal } from '../datepickerModal/datepickerModal';
import { ImageUploaderPopover } from '../../popovers/imageUploader/imageUploaderPopover.component';
import { GalleryImgActionPopover } from '../../popovers/galleryImgAction/galleryImgActionPopover.component';

@Component({
  selector: 'JunctureModal',
  templateUrl: 'junctureModal.html'
})
export class JunctureModal {

  editorOptions = {
    placeholderText: 'Write something insightful...',
    heightMin: '300px',
    heightMax: '525px',
    toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', '|', 'fontFamily', 'fontSize', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'indent', '|', 'specialCharacters', 'selectAll', 'clearFormatting', 'html', '|', 'undo', 'redo']
  };

  junctureModel = { name: 'Juncture ' + moment().format('l'), time: Date.now(), description: '', selectedTrip: null, photoHasChanged: [], type: 'HIKE' };
  inited = false;
  junctureSaveType = 'Publish';
  tripOptions = null;
  typeOptions = [
    { label: 'Hike', value: 'HIKE' },
    { label: 'Bike', value: 'BIKE' },
    { label: 'Run', value: 'RUN' },
    { label: 'Transportation', value: 'TRANSPORTATION' },
    { label: 'Flight', value: 'FLIGHT' },
  ];
  geoJsonObject: Object = null;

  galleryPhotos = [];
  markerURL: string = null;
  startMarkerURL: string;

  coords = { lat: null, lon: null };
  mapStyle;
  zoomLevel = 12;
  dataLayerStyle;
  latlngBounds;
  gpxLoaded = false;
  gpxChanged = false;

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
    private sanitizer: DomSanitizer,
    private geoService: GeoService
  ) {

    this.dataLayerStyle = {
      clickable: false,
      strokeColor: this.settingsService.secondaryColor,
      strokeWeight: 3
    };

    // grab existing trip if it exists
    if (this.params.data.junctureId) {
      this.apiService.getFullJunctureById(this.params.data.junctureId, this.userService.user.id).valueChanges.subscribe(
        result => {
          console.log(result);
          const junctureData: Juncture = result.data.junctureById;
          // populate model
          this.junctureModel.name = junctureData.name;
          this.junctureModel.description = junctureData.description;
          this.junctureModel.selectedTrip = junctureData.tripByTripId.id;
          this.junctureModel.time = +junctureData.arrivalDate;
          this.junctureModel.type = junctureData.type;
          this.coords.lat = +junctureData.lat;
          this.coords.lon = +junctureData.lon;
          this.markerURL = junctureData.markerImg;
          this.galleryPhotos = junctureData.imagesByJunctureId.nodes;

          // check which type of juncture it is
          if (!junctureData.coordsByJunctureId.nodes.length) {
            // if no coords put on manual tab
            this.selectedIndex = 1;
          } else {
            // if coords populate data
            // fitting the map to the data layer OR the marker
            this.geoJsonObject = this.geoService.generateGeoJSON([junctureData.coordsByJunctureId.nodes]);
            this.mapsAPILoader.load().then(() => {
              this.latlngBounds = new window['google'].maps.LatLngBounds();
              // take five coord pairs from the coords arr evenly spaced to hopefully encapsulate all the bounds
              const chosenCoords = [];
              const desiredNumberPairs = 5;
              for (let i = 0; i < junctureData.coordsByJunctureId.nodes.length && chosenCoords.length < desiredNumberPairs; i += Math.ceil(junctureData.coordsByJunctureId.nodes.length / desiredNumberPairs)) {
                chosenCoords.push(junctureData.coordsByJunctureId.nodes[i]);
              }

              chosenCoords.forEach((pair) => {
                this.latlngBounds.extend(new window['google'].maps.LatLng(pair.lat, pair.lon));
              });

              this.gpxLoaded = true;
            });
          }

          this.grabMapStyle();

          // populate trip select
          this.tripOptions = [{ id: junctureData.tripByTripId.id, name: junctureData.tripByTripId.name }];
        }
      );
    } else {
      this.markerURL = this.params.data.markerImg;

      // grab trips to populate select
      this.apiService.tripsByUserId(this.userService.user.id).valueChanges.subscribe(
        (data: any) => {
          this.tripOptions = data.data.allTrips.nodes;
          if (this.tripOptions[0]) this.junctureModel.selectedTrip = this.tripOptions[0].id;
        }
      );
      // grab location for map
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((location: any) => {
          console.log(location.coords);
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

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  onGPXProcessed(gpxData) {
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
      this.gpxChanged = true;
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
            console.log(data);
            data.forEach((img) => {
              if (img.size === 'marker') {
                this.markerURL = img.url;
              } else {
                this.galleryPhotos = [...this.galleryPhotos];
                this.galleryPhotos.push({
                  id: null,
                  url: img.url,
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
    const popover = this.popoverCtrl.create(GalleryImgActionPopover, { model: this.galleryPhotos[index] }, { cssClass: 'galleryImgActionPopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      if (data) {
        if (data.action === 'delete') {
          this.alertService.confirm(
            'Delete Gallery Image',
            'Are you sure you want to delete permanently delete this image? This action cannot be reversed',
            { label: 'Delete', handler: () =>  {
              // if photo has already been saved to db
              if (this.galleryPhotos[index].id) {
                this.galleryPhotos = [...this.galleryPhotos];
                this.apiService.deleteImageById(this.galleryPhotos[index].id).subscribe(
                  result => {
                    this.galleryPhotos.splice(index, 1);
                    this.toastDelete('Gallery image deleted');
                  }
                );
              } else {
                this.galleryPhotos.splice(index, 1);
                this.toastDelete('Gallery image deleted');
              }
            }}
          );
        } else {
          // update photo
          const editedPhoto = {...this.galleryPhotos[index]};
          editedPhoto.description = data.data.description;

          this.junctureModel.photoHasChanged.push(editedPhoto);
        }
      }
    });
  }

  saveJuncture() {
    if (!this.junctureModel.name) {
      this.alertService.alert('Missing Information', 'Please enter a name for your juncture and try to save again.');
    } else if (this.selectedIndex === 0 && !this.geoJsonObject) {
      this.alertService.alert('Notification', 'Upload gpx data or try a manual location for your juncture.');
    } else {
      this.viewCtrl.dismiss({
        isExisting: this.params.data.junctureId ? true : false,
        saveType: this.junctureSaveType,
        name: this.junctureModel.name,
        description: this.junctureModel.description,
        type: this.junctureModel.type,
        photos: this.galleryPhotos,
        time: this.junctureModel.time,
        location: this.coords,
        selectedTrip: this.junctureModel.selectedTrip,
        markerImg: this.markerURL,
        geoJSON: this.geoJsonObject,
        gpxChanged: this.gpxChanged,
        changedPhotos: this.junctureModel.photoHasChanged
      });
    }
  }

  moveCenter(e) {
    this.coords.lat = e.lat;
    this.coords.lon = e.lng;
  }

  deleteJuncture() {
    this.alertService.confirm(
      'Delete Juncture',
      'Are you sure you want to delete this juncture? All the associated information will be deleted and this action cannot be reversed',
      { label: 'Delete Juncture', handler: () =>  {
        this.apiService.deleteJunctureById(this.params.data.junctureId).subscribe(
          result => {
            console.log(result);
            this.toastDelete('Juncture deleted');
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

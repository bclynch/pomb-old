import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { APIService } from '../../../services/api.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'ImageUploaderPopover',
  templateUrl: 'imageUploaderPopover.component.html'
})
export class ImageUploaderPopover {

  allowMultiple: boolean;
  type: string;
  capitalizedType: string;
  isProcessing: boolean = false;
  filesToUpload: Array<File> = [];
  urlArr: string[] = [];
  postSize: 'small' | 'large';
  maxImgs: number;

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams,
    private apiService: APIService,
    private alertService: AlertService
  ) {
    this.allowMultiple = params.get('type') === 'gallery';
    this.type = params.get('type');
    this.maxImgs = params.get('max');
    this.capitalizedType = this.type.charAt(0).toUpperCase() + this.type.slice(1);
    this.postSize = params.get('size');
  }

  processFormData(): FormData {
    const formData: FormData = new FormData();
    const files: Array<File> = this.filesToUpload;

    for (let file of files) {
      console.log(file);
      formData.append('uploads[]', file, file.name);
    }

    this.isProcessing = true;
    return formData;
  }

  uploadPrimaryPhoto() {
    const formData = this.processFormData();

    this.apiService.uploadPrimaryPhoto(formData).subscribe(
      result => {
        console.log(result);
        this.isProcessing = false;
        this.viewCtrl.dismiss(result);
      }
    );
  }

  uploadPhoto() {
    const formData = this.processFormData();

    this.apiService.uploadPhoto(formData, this.postSize).subscribe(
      result => {
        console.log(result);
        this.urlArr.push(result);
        this.isProcessing = false;
        this.viewCtrl.dismiss({ arr: this.urlArr, size: this.postSize });
      }
    );
  }

  uploadGalleryPhotos() {
    const formData = this.processFormData();

    console.log(this.filesToUpload.length);
    console.log(this.params.get('existingPhotos'));

    if(this.filesToUpload.length + this.params.get('existingPhotos') > 12) {
      this.viewCtrl.dismiss('maxErr');
    } else {
      this.apiService.uploadGalleryPhotos(formData).subscribe(
        result => {
          console.log(result);
          this.isProcessing = false;
          this.viewCtrl.dismiss(result);
        }
      );
    }
  }

  uploadBannerPhoto() {
    const formData = this.processFormData();

    this.apiService.uploadBannerPhoto(formData).subscribe(
      result => {
        console.log(result);
        this.isProcessing = false;
        this.viewCtrl.dismiss(result);
      }
    );
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;

    switch(this.type) {
      case 'banner':
        this.uploadBannerPhoto();
        break;
      case 'primary':
        this.uploadPrimaryPhoto();
        break;
      case 'gallery':
        this.uploadGalleryPhotos();
        break;
      default:
        this.uploadPhoto();
        break;
    }
  }

  closePopover() {
    if(this.isProcessing) {
      this.alertService.confirm('Processing', 'Are you sure you want to disrupt the image upload processing?', { label: 'Close', handler: () => this.viewCtrl.dismiss()});
    } else {
      this.viewCtrl.dismiss();
    }
  }
}
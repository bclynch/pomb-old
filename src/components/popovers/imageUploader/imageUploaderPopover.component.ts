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
  imgSize: { width: number, height: number }; 
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
    this.imgSize = params.get('size');
  }

  private processFormData(): FormData {
    const formData: FormData = new FormData();
    const files: Array<File> = this.filesToUpload;

    for (let file of files) {
      console.log(file);
      formData.append('uploads[]', file, file.name);
    }

    this.isProcessing = true;
    return formData;
  }

  uploadImages(sizes: { width: number; height: number; }[], quality: number, max?: number) {
    const formData = this.processFormData();

    // console.log(this.filesToUpload.length);
    // console.log(this.params.get('existingPhotos'));

    if (max && this.filesToUpload.length + this.params.get('existingPhotos') > max) {
      this.viewCtrl.dismiss('maxErr');
      return;
    }
    this.apiService.uploadImages(formData, sizes, quality).subscribe(
      result => {
        console.log(result);
        this.isProcessing = false;
        this.viewCtrl.dismiss(result);
      }
    );
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;

    switch (this.type) {
      case 'banner':
        this.uploadImages([{ width: 1200, height: 300 }], 80);
        break;
      case 'primary':
        this.uploadImages([{ width: 320, height: 213 }, { width: 1220, height: 813 }], 80);
        break;
      case 'gallery':
        this.uploadImages([{ width: 1220, height: 813 }], 80, 12);
        break;
      case 'profile':
        this.uploadImages([{ width: 250, height: 250 }], 80);
        break;
      case 'custom':
        this.uploadImages([this.imgSize], 80);
        break;
    }
  }

  closePopover() {
    if (this.isProcessing) {
      this.alertService.confirm('Processing', 'Are you sure you want to disrupt the image upload processing?', { label: 'Close', handler: () => this.viewCtrl.dismiss() });
    } else {
      this.viewCtrl.dismiss();
    }
  }
}
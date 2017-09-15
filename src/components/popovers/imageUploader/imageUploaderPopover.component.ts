import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { APIService } from '../../../services/api.service';

@Component({
  selector: 'ImageUploaderPopover',
  templateUrl: 'imageUploaderPopover.component.html'
})
export class ImageUploaderPopover {

  allowMultiple: boolean;
  type: string;
  capitalizedType: string;
  primaryLoading: boolean = false;
  filesToUpload: Array<File> = [];
  urlArr: string[] = [];
  postSize: 'small' | 'large';

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams,
    private apiService: APIService
  ) {
    this.allowMultiple = params.get('type') === 'gallery';
    this.type = params.get('type');
    this.capitalizedType = this.type.charAt(0).toUpperCase() + this.type.slice(1);
  }
 
  // selectOption(option: string) {
  //   this.viewCtrl.dismiss(option);
  // }

  uploadPrimaryPhoto() {
    const formData: FormData = new FormData();
    const files: Array<File> = this.filesToUpload;

    for (let file of files) {
      console.log(file);
      formData.append('uploads[]', file, file.name);
    }

    this.primaryLoading = true;
    this.apiService.uploadPrimaryPhoto(formData).subscribe(
      result => {
        console.log(result);
        if (result.length) {
          this.urlArr.push(result[0].url);
          this.primaryLoading = false;
          // this.viewCtrl.dismiss(this.urlArr);
        }
      }
    )
  }

  uploadPostPhoto() {
    const formData: FormData = new FormData();
    const files: Array<File> = this.filesToUpload;

    for (let file of files) {
      console.log(file);
      formData.append('uploads[]', file, file.name);
    }

    this.primaryLoading = true;
    this.apiService.uploadPostPhoto(formData, this.postSize).subscribe(
      result => {
        console.log(result);
        this.urlArr.push(result);
        this.primaryLoading = false;
        this.viewCtrl.dismiss({ arr: this.urlArr, size: this.postSize });
      }
    )
  }

  uploadGalleryPhotos() {

  }

  uploadBannerPhoto() {
    const formData: FormData = new FormData();
    const files: Array<File> = this.filesToUpload;

    for (let file of files) {
      console.log(file);
      formData.append('uploads[]', file, file.name);
    }

    this.primaryLoading = true;
    this.apiService.uploadBannerPhoto(formData).subscribe(
      result => {
        console.log(result);
        this.primaryLoading = false;
        this.viewCtrl.dismiss(result);
      }
    )
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;

    switch(this.type) {
      case 'post':
        this.uploadPostPhoto()
        break;
      case 'banner':
        this.uploadBannerPhoto();
        break;
      case 'primary':
        this.uploadPrimaryPhoto();
        break;
      case 'gallery':
        this.uploadGalleryPhotos();
        break;
    }
  }
}
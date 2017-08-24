import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ViewController, NavParams, AlertController, PopoverController } from 'ionic-angular';

import { APIService } from '../../../services/api.service';
import { Http, Response } from '@angular/http';

import { Post } from '../../../models/Post.model';

import { PostTypePopover } from '../../popovers/postType/postTypePopover.component';

interface PostOption {
  name: string;
  description: string;
  secondaryDescription: string;
}

@Component({
  selector: 'CreatePostModal',
  templateUrl: 'createPostModal.html'
})
export class CreatePostModal {
  @ViewChild('fileInput') inputEl: ElementRef;

  containerOptions: string[] = ['Content', 'Options'];
  activeContainerOption: number = 0;
  btnOptions: string[] = ['Cancel', 'Delete', 'Save', 'Save & Publish'];
  postModel = {postTitle: '', postSubtitle: '', content: '', leadPhoto: '', leadPhotoTitle: ''};
  data: Post;

  filesToUpload: Array<File> = [];

  //https://www.froala.com/wysiwyg-editor/docs/options#toolbarButtons
  editorOptions: Object = {
    placeholderText: 'Write something insightful...',
    heightMin: '300px',
    heightMax: '475px',
    toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', '|', 'fontFamily', 'fontSize', 'color', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertImage', 'insertVideo', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo']
  }

  activePostOption: number = 2;
  postOptions: PostOption[] = [
    {name: 'Published', description: 'Publish this post now', secondaryDescription: 'Published on ...'},
    {name: 'Scheduled', description: 'Publish this post in the future', secondaryDescription: 'Publish in ...'},
    {name: 'Draft', description: 'Save this post for later editing', secondaryDescription: 'This post will not be visible'}
  ]

  constructor(
    public viewCtrl: ViewController,
    private apiService: APIService,
    private alertCtrl: AlertController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private http: Http,
  ) {
    this.data = params.get('post');
    if(this.data) {
      this.postModel.postTitle = this.data.title;
      this.postModel.postSubtitle = this.data.subtitle;
      this.postModel.content = this.data.content;
      this.postModel.leadPhoto = this.data.leadphoto;

      this.activePostOption = this.data.isDraft ? 2 : this.data.isScheduled ? 1 : 0;
    }
  }

  clickBtn(index) {
    switch(index) {
      case 0:
        this.cancelConfirm();
        break;
      case 1:
        this.deleteConfirm();
        break;
      case 2:
        this.savePost();
        break;
      case 3:
        this.savePost(true);
        break;
    }
  }

  cancelConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Review Changes',
      subTitle: 'You have unsaved work, do you want to save or discard it?',
      cssClass: 'confirmAlert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Discard',
          handler: () => {
            this.viewCtrl.dismiss();
          }
        },
        {
          text: 'Save',
          handler: () => {
            this.savePost();
          }
        }
      ]
    });
    alert.present();
  }

  deleteConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Discard Post',
      subTitle: 'Are you sure you want to discard this post?',
      cssClass: 'confirmAlert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('Delete post');
            this.viewCtrl.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  savePost(publish?: boolean) {
    console.log('Save work api call');
    if(publish) console.log('publish too');
    this.viewCtrl.dismiss();
  }

  presentPopover(e) { 
    let popover = this.popoverCtrl.create(PostTypePopover, {options: this.postOptions}, { cssClass: 'postTypePopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      if(data) this.activePostOption = data;
    });
  }

  // fileChange(e) {
  //   console.log(e);
  //   let files = e.target.files;
  //   if (files.length > 0) {
  //     let formData: FormData = new FormData();
  //     console.log(formData);
  //     for (let file of files) {
  //       console.log(file);
  //         formData.append('files', file, file.name);
  //     }
  //     console.log(formData.getAll('files'));
  //     // this.apiService.testImgs(formData.getAll('files')).subscribe((result) => {
  //     //   console.log(result);
  //     // });
  //     this.apiService.derp(formData).subscribe((result) => {
  //       console.log(result);
  //     });
  //   }
  // }

  // upload() {
  //   let inputEl: HTMLInputElement = this.inputEl.nativeElement;
  //   let fileCount: number = inputEl.files.length;
  //   let formData = new FormData();
  //   if (fileCount > 0) { // a file was selected
  //     for (let i = 0; i < fileCount; i++) {
  //         formData.append('file[]', inputEl.files.item(i));
  //     }
  //     const headers = new Headers();
  //     headers.append('Content-Type', 'multipart/form-data');
  //     headers.append('Accept', 'application/json');
  //     const body = JSON.stringify({ headers: headers });
  //     console.log(formData.getAll('file[]'));
  //     this.apiService.testImgs(formData, body).subscribe((result) => {
  //       console.log(result);
  //     });
  //   }
  // }
    // let fileList: FileList = e.target.files;
    // if(fileList.length > 0) {
    //   let file: File = fileList[0];
    //   //get signed request node server
    //   this.apiService.testImgs(file).subscribe((result) => {
    //     console.log(result);
    //   });
    // }
  // }

  upload() {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;

    // formData.append("uploads[]", files[0], files[0]['name']);
    for (let file of files) {
      console.log(file);
      formData.append('uploads[]', file, file.name);
    }
    
    this.http.post('http://localhost:8080/upload', formData)
      .map(files => files.json())
      .subscribe(files => console.log('files', files))
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    //this.product.photo = fileInput.target.files[0]['name'];
  }

}

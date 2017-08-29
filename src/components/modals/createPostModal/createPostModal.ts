import { Component } from '@angular/core';
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

  containerOptions: string[] = ['Content', 'Options'];
  activeContainerOption: number = 0;
  btnOptions: string[] = ['Cancel', 'Delete', 'Save', 'Save & Publish'];
  postModel = {postTitle: '', postSubtitle: '', content: '', leadPhoto: '', leadPhotoTitle: ''};
  data: Post;
  primaryLoading: boolean = false;
  thumbnailImage: string;

  filesToUpload: Array<File> = [];

  //https://www.froala.com/wysiwyg-editor/docs/options#toolbarButtons
  editorOptions: Object = {
    // placeholderText: 'Write something insightful...',
    heightMin: '300px',
    heightMax: '525px',
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

  upload() {
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
        if(result.length) {
          this.thumbnailImage = result[0].url;
          this.primaryLoading = false;
          console.log(this.thumbnailImage);
        }
      }
    )
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;

    this.upload();
  }

}

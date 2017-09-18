import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { ViewController, NavParams, AlertController, PopoverController, ModalController } from 'ionic-angular';
import moment from 'moment';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';

import { Post, PostCategory } from '../../../models/Post.model';
import { Tag } from '../../../models/Tag.model';
import { GalleryPhoto } from '../../../models/GalleryPhoto.model';

import { PostTypePopover } from '../../popovers/postType/postTypePopover.component';
import { ImageUploaderPopover } from '../../popovers/imageUploader/imageUploaderPopover.component';
import { GalleryImgActionPopover } from '../../popovers/galleryImgAction/galleryImgActionPopover.component';
import { DatePickerModal } from '../../modals/datepickerModal/datepickerModal';

declare let $: any;

interface PostOption {
  name: string;
  description: string;
  secondaryDescription: string;
}

interface RelativeTime {
  label: string;
  value: number;
}

interface PostModel {
  postTitle: string;
  postSubtitle: string;
  content: string;
  category: PostCategory;
  leadPhoto: string;
  leadPhotoTitle: string;
}

@Component({
  selector: 'CreatePostModal',
  templateUrl: 'createPostModal.html'
})
export class CreatePostModal {

  containerOptions: string[] = ['Content', 'Options', 'Gallery'];
  activeContainerOption: number = 0;
  btnOptions: string[] = ['Cancel', 'Delete', 'Save'];
  postModel: PostModel = { postTitle: '', postSubtitle: '', content: '', category: null, leadPhoto: '', leadPhotoTitle: '' };
  data: Post;
  primaryLoading: boolean = false;

  filesToUpload: Array<File> = [];

  //https://www.froala.com/wysiwyg-editor/docs/options#toolbarButtons
  editorOptions: Object;

  activePostOption: number = 2;
  postOptions: PostOption[] = [
    { name: 'Published', description: 'Publish this post now', secondaryDescription: 'Publish ' },
    { name: 'Scheduled', description: 'Publish this post in the future', secondaryDescription: 'Schedule for ' },
    { name: 'Draft', description: 'Save this post for later editing', secondaryDescription: 'This post will not be visible' }
  ];

  scheduledModel: RelativeTime = { label: 'now', value: Date.now() };
  publishModel: RelativeTime = { label: 'now', value: Date.now() };

  categoryOptions: string[] = Object.keys(this.settingsService.appCategories);

  tagOptions: Tag[] = [];

  galleryPhotos: GalleryPhoto[] = [];

  constructor(
    public viewCtrl: ViewController,
    private apiService: APIService,
    private alertCtrl: AlertController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private http: Http,
    private settingsService: SettingsService,
    private modalController: ModalController
  ) {
    this.data = params.get('post');
    console.log(this.data);
    if (this.data) {
      this.postModel.postTitle = this.data.title;
      this.postModel.postSubtitle = this.data.subtitle;
      this.postModel.content = this.data.content;
      this.postModel.category = this.data.category;
      this.postModel.leadPhoto = this.data.postLeadPhotosByPostId.nodes[0].leadPhotoLinksByLeadPhotoId.nodes[0].url;
      this.postModel.leadPhotoTitle = this.data.postLeadPhotosByPostId.nodes[0].title;
      this.data.postToTagsByPostId.nodes.forEach((tag) => {
        this.tagOptions.push(tag.postTagByPostTagId);
      });
      this.data.postToGalleryPhotosByPostId.nodes.forEach((photo) => {
        this.galleryPhotos.push(photo);
      });
      if (this.data.scheduledDate) {
        this.scheduledModel.value = +this.data.scheduledDate;
        this.scheduledModel.label = moment(+this.data.scheduledDate).fromNow();
      }
      if (this.data.publishedDate) {
        this.publishModel.value = +this.data.publishedDate;
        this.publishModel.label = moment(+this.data.publishedDate).fromNow();
      }

      this.activePostOption = this.data.isDraft ? 2 : this.data.isScheduled ? 1 : 0;
    }

    //creating custom image uploader
    $.FroalaEditor.DefineIcon('myImageUploader', { NAME: 'image' });
    const self = this;
    $.FroalaEditor.RegisterCommand('myImageUploader', {
      title: 'Upload Image',
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback: function () {
        self.presentImageUploaderPopover('post').then((data) => {
          if(data) this.html.insert(`<img src="${data.arr[0].url}" width="${data.size === 'large' ? '100%' : '50%'}" />`); 
        });
      }
    });

    this.editorOptions = {
      // placeholderText: 'Write something insightful...',
      heightMin: '300px',
      heightMax: '525px',
      toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', '|', 'fontFamily', 'fontSize', 'color', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'myImageUploader', 'insertVideo', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo']
    }
  }

  clickBtn(index) {
    switch (index) {
      case 0:
        this.cancelConfirm();
        break;
      case 1:
        this.deleteConfirm();
        break;
      case 2:
        this.savePost();
        break;
    }
  }

  selectCategory(category: string) {
    this.postModel.category = PostCategory[category];
  }

  categoryActive(category: string) {
    return category === PostCategory[this.postModel.category];
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
            this.viewCtrl.dismiss('delete');
          }
        }
      ]
    });
    alert.present();
  }

  savePost() {
    //if has a post we know its a put otherwise a post
    this.data ? this.updatePost() : this.createPost();
  }

  updatePost() {
    //this.data is the original data passed in and shouldn't be mutated
    //We can use this as a ref to know if we need to pass in new edits/changes
    this.apiService.updatePostById(this.data.id, this.postModel.postTitle, this.postModel.postSubtitle, this.postModel.content, this.postModel.category, this.activePostOption === 2, this.activePostOption === 1, this.activePostOption === 0, this.activePostOption === 1 ? this.scheduledModel.value : null, this.activePostOption === 0 ? this.publishModel.value : null)
      .subscribe(
      result => {
        let updatePromises = [];
        //check if photo title has changed. If so update postLeadPhoto
        updatePromises.push(this.comparePhoto());

        //check if leadPhotoLink url has changed. If so update leadPhotoLink

        //check if tags have changed. If so update post tags and or post to tags as required          
        updatePromises.push(this.compareTags(this.data.postToTagsByPostId.nodes));

        //when all the above have resolved dismiss the modal
        Promise.all(updatePromises).then(() => {
          this.viewCtrl.dismiss('refresh');
        });
      }
      )
  }

  createPost() {
    this.apiService.createPost(1, this.postModel.postTitle, this.postModel.postSubtitle, this.postModel.content, this.postModel.category, this.activePostOption === 2, this.activePostOption === 1, this.activePostOption === 0, this.activePostOption === 1 ? this.scheduledModel.value : null, this.activePostOption === 0 ? this.publishModel.value : null)
      .subscribe(
      result => {
        console.log(result);
        const createPostData = <any>result;

        //lumping a few different calls for categories and lead photo together to save on API calls
        this.apiService.processPost(createPostData.data.createPost.post.id, this.postModel.leadPhotoTitle, 123, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg').subscribe(
          processPostData => {
            console.log(processPostData);

            this.createTagsMutation(createPostData.data.createPost.post.id, this.tagOptions).then(
              result => {
                this.viewCtrl.dismiss('refresh');
              }, err => {
                console.log(err);
                alert('something is fucked');
                this.viewCtrl.dismiss('refresh');
              }
            );
          }
        )
      }
      )
  }

  createTagsMutation(postId: number, tagsArr: Tag[]) {
    return new Promise((resolve, reject) => {
      let finalTags: Tag[] = [];
      //first need to create any totally new tags and add to db
      let promiseArr = [];
      if (tagsArr.length) {
        tagsArr.forEach((tag, i) => {
          if (!tag.id) {
            let promise = new Promise((resolve, reject) => {
              this.apiService.createPostTag(tag.name).subscribe(
                data => {
                  const tagData = <any>data;
                  finalTags.push(tagData.data.createPostTag.postTag);
                  resolve();
                }
              )
            });
            promiseArr.push(promise);
          } else {
            finalTags.push(tag);
          }
        });

        Promise.all(promiseArr).then(() => {
          console.log('promise all complete');

          //then bulk add tag to post
          let query = `mutation {`;
          finalTags.forEach((tag, i) => {
            query += `a${i}: createPostToTag(input: {
              postToTag:{
                postId: ${postId},
                postTagId: ${tag.id}
              }
            }) {
              clientMutationId
            }`;
          });
          query += `}`;

          this.apiService.createPostToTag(query).subscribe(
            result => resolve(result),
            err => console.log(err)
          )
        });
      } else {
        resolve();
      }
    });
  }

  compareTags(existingTags: { id: number, postTagByPostTagId: Tag }[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      //checking for dif between arrays
      const diffExisting = existingTags.filter(x => this.tagOptions.indexOf(x.postTagByPostTagId) < 0);
      console.log(diffExisting); // remove post to tag
      const moddedExisting = this.data.postToTagsByPostId.nodes.map((value) => { return value.postTagByPostTagId });
      const diffNew = this.tagOptions.filter(x => moddedExisting.indexOf(x) < 0);
      console.log(diffNew); // create tag + post to tag

      //if no changes resolve
      if (!diffExisting.length && !diffNew.length) resolve();

      //If no diff existing
      //send these off to create tags mutation
      if (!diffExisting.length) {
        this.createTagsMutation(this.data.id, diffNew).then(
          result => resolve()
        )
      }

      //Has diff existing so run a for each and delete
      diffExisting.forEach((tag, i) => {
        const tagData = <any>tag;
        this.apiService.deletePostToTagById(tagData.id).subscribe(
          result => {
            console.log(result);

            //if the last tag deleted then cont
            if (i === diffExisting.length - 1) {
              //send these off to create tags mutation
              this.createTagsMutation(this.data.id, diffNew).then(
                result => resolve()
              )
            }
          }
        );
      });
    });
  }

  comparePhoto(): Promise<{}> {
    return new Promise((resolve, reject) => {
      if (this.data.postLeadPhotosByPostId.nodes[0].title !== this.postModel.leadPhotoTitle) {
        //api call to update then resolve
        this.apiService.updateLeadPhotoInfo(this.data.postLeadPhotosByPostId.nodes[0].id, this.postModel.leadPhotoTitle).subscribe(
          result => resolve()
        )
      } else {
        resolve();
      }
    });
  }

  presentPopover(e) {
    let popover = this.popoverCtrl.create(PostTypePopover, { options: this.postOptions }, { cssClass: 'postTypePopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      if (data !== null) this.activePostOption = data;
    });
  }

  presentImageUploaderPopover(type: string): Promise<{ arr: { url: string, width: number }[], size: string }> {
    return new Promise((resolve, reject) => {
      let popover = this.popoverCtrl.create(ImageUploaderPopover, { type }, { cssClass: 'imageUploaderPopover' });
      popover.present();
      popover.onDidDismiss((data) => {
        //return arr of images (in this case one)
        resolve(data);
      });
    });
  }

  presentGalleryPopover(e) {
    let popover = this.popoverCtrl.create(GalleryImgActionPopover, {  }, { cssClass: 'galleryImgActionPopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      if(data) {
        if(data.action === 'delete') {
          //delete photo
          console.log('delete photo');
        } else {
          //update photo
          console.log('update photo');
        }
      }
    });
  }

  presentDatepickerModal(e: Event) {
    e.stopPropagation();

    if (this.postOptions[this.activePostOption].name !== 'Draft') {
      let modal = this.modalController.create(DatePickerModal, { date: this.postOptions[this.activePostOption].name === 'Scheduled' ? this.scheduledModel.value : this.publishModel.value }, {});
      modal.present({
        ev: e
      });
      modal.onDidDismiss((data: any) => {
        console.log(Date.parse(data));
        if (data) {
          if (this.postOptions[this.activePostOption].name === 'Scheduled') {
            this.scheduledModel.label = moment(data).fromNow();
            this.scheduledModel.value = Date.parse(data);
          } else {
            this.publishModel.label = moment(data).fromNow();
            this.publishModel.value = Date.parse(data);
          }
        }
      });
    }
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
        if (result.length) {
          this.postModel.leadPhoto = result[0].url;
          this.primaryLoading = false;
          console.log(this.postModel.leadPhoto);
        }
      }
    )
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;

    this.upload();
  }

  addTag(data: Tag) {
    let exists: boolean = false;
    this.tagOptions.forEach((tag) => {
      if (tag.name === data.name) exists = true;
    });
    if (!exists) this.tagOptions.push(data);
  }

  removeTag(i: number) {
    this.tagOptions.splice(i, 1);
  }
}

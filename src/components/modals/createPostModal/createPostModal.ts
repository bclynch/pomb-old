import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { ViewController, NavParams, AlertController, PopoverController, ModalController, ToastController } from 'ionic-angular';
import moment from 'moment';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { AlertService } from '../../../services/alert.service';
import { UserService } from '../../../services/user.service';

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
  leadPhotoTitle: string;
}

interface LeadPhoto {
  size: number;
  url: string;
}

@Component({
  selector: 'CreatePostModal',
  templateUrl: 'createPostModal.html'
})
export class CreatePostModal {

  containerOptions: string[] = ['Content', 'Options', 'Gallery'];
  activeContainerOption: number = 0;
  btnOptions: string[] = ['Cancel', 'Delete', 'Save'];
  postModel: PostModel = { postTitle: '', postSubtitle: '', content: '', category: null, leadPhotoTitle: '' };
  data: Post;

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
  galleryItemHasChanged: GalleryPhoto[] = [];
  leadPhotoLinks: LeadPhoto[] = [];
  displayedLeadPhoto: LeadPhoto;

  constructor(
    public viewCtrl: ViewController,
    private apiService: APIService,
    private alertCtrl: AlertController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private http: Http,
    private settingsService: SettingsService,
    private modalController: ModalController,
    private alertService: AlertService,
    private toastCtrl: ToastController,
    private userService: UserService
  ) {
    this.data = params.get('post');
    console.log(this.data);
    if (this.data) {
      this.postModel.postTitle = this.data.title;
      this.postModel.postSubtitle = this.data.subtitle;
      this.postModel.content = this.data.content;
      this.postModel.category = this.data.category;
      this.leadPhotoLinks = this.data.postLeadPhotosByPostId.nodes[0].leadPhotoLinksByLeadPhotoId.nodes;
      this.displayedLeadPhoto = this.selectSmallLeadPhoto(this.leadPhotoLinks);
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

  selectSmallLeadPhoto(arr: LeadPhoto[]): LeadPhoto {
    let smallPhoto: LeadPhoto;
    arr.forEach((photo) => {
      if(photo.size === 320) smallPhoto = photo;
    });
    return smallPhoto;
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
    //validate required fields filled out if post status is scheduled or publish
    if(this.activePostOption !== 2) {
      const requiredFields: { field: any, label: string }[] = [
        { field: this.postModel.postTitle, label: 'post title' }, 
        { field: this.postModel.postSubtitle, label: 'post subtitle' }, 
        { field: this.postModel.content, label: 'post content' }, 
        { field: this.postModel.category, label: 'category' }, 
        { field: this.postModel.leadPhotoTitle, label: 'primary image title' }, 
        { field: this.displayedLeadPhoto, label: 'primary image' }
      ];
      for(let i = 0; i < requiredFields.length; i++) {
        if(!requiredFields[i].field) {
          this.alertService.alert('Error', `In order to publish or schedule a post all required fields must be filled out. Please check the ${requiredFields[i].label} field and try again.`);
          return;
        }
      }
    }

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

        //check if leadPhotoLink url has changed. If so update leadPhotoLinks
        updatePromises.push(this.comparePhotoLinks());

        //check for new + edited gallery photos to update
        updatePromises.push(this.compareGalleryPhotos(this.data.id));

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
    const self = this;
    //Add most of the model to our post table
    this.apiService.createPost(this.userService.user.id, this.postModel.postTitle, this.postModel.postSubtitle, this.postModel.content, this.postModel.category, this.activePostOption === 2, this.activePostOption === 1, this.activePostOption === 0, this.activePostOption === 1 ? this.scheduledModel.value : null, this.activePostOption === 0 ? this.publishModel.value : null)
      .subscribe(
        result => {
          console.log(result);
          const createPostData = <any>result;

          //Create lead photo
          this.apiService.createPostLeadPhoto(createPostData.data.createPost.post.id, this.postModel.leadPhotoTitle).subscribe(
            postLeadPhoto => {
              console.log(postLeadPhoto);
              const postLeadPhotoData = <any>postLeadPhoto;

              //create links for lead photo
              this.createLeadPhotoLinks(postLeadPhotoData.data.createPostLeadPhoto.postLeadPhoto.id).then(
                () => {

                  //create gallery photo links
                  this.createGalleryPhotoLinks(createPostData.data.createPost.post.id, this.galleryPhotos).then(
                    () => {

                      //create tags + save as required
                      this.createTagsMutation(createPostData.data.createPost.post.id, this.tagOptions).then(
                        result => {
                          this.viewCtrl.dismiss('refresh');
                        }, err => createPostErrorHandler(err)
                      );
                    }, err => createPostErrorHandler(err)
                  )
                }, err => createPostErrorHandler(err)
              )
            }, err => createPostErrorHandler(err)
          );
        }
      );

      function createPostErrorHandler(err: Error) {
        console.log(err);
        alert('something is fucked');
        self.viewCtrl.dismiss('refresh');
      }
  }

  createLeadPhotoLinks(leadPhotoId: number) {
    return new Promise((resolve, reject) => {
      //then bulk add links to post
      if(this.leadPhotoLinks.length) {
        let query = `mutation {`;
        console.log(this.leadPhotoLinks);
        this.leadPhotoLinks.forEach((photo, i) => {
          query += `a${i}: createLeadPhotoLink(input: {
            leadPhotoLink:{
              leadPhotoId: ${leadPhotoId},
              size: ${photo.size},
              url: "${photo.url}"
            }
          }) {
            clientMutationId
          }`;
        });
        query += `}`;
  
        this.apiService.genericCall(query).subscribe(
          result => resolve(result),
          err => console.log(err)
        );
      } else {
        resolve();
      }
    });
  }

  createGalleryPhotoLinks(postId: number, photoArr: GalleryPhoto[]) {
    return new Promise((resolve, reject) => {
      if(!photoArr.length) resolve();

      //bulk add links to post
      let query = `mutation {`;
      photoArr.forEach((photo, i) => {
        query += `a${i}: createPostToGalleryPhoto(input:{
          postToGalleryPhoto:{
            postId: ${postId},
            galleryPhotoUrl: "${photo.galleryPhotoUrl}",
            description: "${photo.description}"
          }
        }) {
          clientMutationId
        }`;
      });
      query += `}`;

      this.apiService.genericCall(query).subscribe(
        result => resolve(result),
        err => console.log(err)
      );
    });
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

          if(finalTags.length) {
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

            this.apiService.genericCall(query).subscribe(
              result => resolve(result),
              err => console.log(err)
            );
          } else {
            resolve();
          }
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

  comparePhotoLinks(): Promise<{}> {
    return new Promise((resolve, reject) => {
      //check to see if there is a lead img at all
      if(this.leadPhotoLinks.length) {

        //check to see if there was formerly a lead img
        if(this.data.postLeadPhotosByPostId.nodes[0].leadPhotoLinksByLeadPhotoId.nodes.length) {

          //compare old vs new
          if (this.selectSmallLeadPhoto(this.data.postLeadPhotosByPostId.nodes[0].leadPhotoLinksByLeadPhotoId.nodes).url !== this.selectSmallLeadPhoto(this.leadPhotoLinks).url) {
            //snag ids of original links + size for ref
            let idRefs: {} = {}
            this.data.postLeadPhotosByPostId.nodes[0].leadPhotoLinksByLeadPhotoId.nodes.forEach((link) => {
              idRefs[`w${link.size}`] = link.id;
            });
  
            //then bulk links to post
            let query = `mutation {`;
            this.leadPhotoLinks.forEach((link, i) => {
              query += `a${i}: updateLeadPhotoLinkById(input: {
                id: ${idRefs[`w${link.size}`]},
                leadPhotoLinkPatch:{
                  url: "${link.url}"
                }
              }) {
                clientMutationId
              }`;
            });
            query += `}`;
  
            this.apiService.genericCall(query).subscribe(
              result => resolve(result),
              err => console.log(err)
            );
          } else {
            resolve();
          }
        } else {
          // if old links didn't exist need to create new ones
          this.createLeadPhotoLinks(this.data.postLeadPhotosByPostId.nodes[0].id).then(() => resolve());
        }
      } else {
        resolve();
      }
    });
  }

  compareGalleryPhotos(postId: number) {
    return new Promise((resolve, reject) => {
      //add newly created photos
      let newPhotoArr: GalleryPhoto[] = this.galleryPhotos.filter((img) => !img.id );
      this.createGalleryPhotoLinks(postId, newPhotoArr).then(
        result => {
          //update edited gallery photos
          //make sure 'new' photos not on 'edited' arr
          let filteredEditedArr = this.galleryItemHasChanged.filter((img => newPhotoArr.indexOf(img) === -1));
          //then bulk update imgs
          if(filteredEditedArr.length) {
            let query = `mutation {`;
            filteredEditedArr.forEach((img, i) => {
              query += `a${i}: updatePostToGalleryPhotoById(input:{
                id: ${img.id},
                postToGalleryPhotoPatch:{
                  description: "${img.description}"
                }
              }) {
                clientMutationId
              }`;
            });
            query += `}`;
  
            this.apiService.genericCall(query).subscribe(
              result => resolve(result),
              err => console.log(err)
            );
          } else {
            resolve();
          }
        }
      )
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
      let popover = this.popoverCtrl.create(ImageUploaderPopover, { type }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
      popover.present();
      popover.onDidDismiss((data) => {
        //return arr of images (in this case one)
        resolve(data);
      });
    });
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
          this.galleryItemHasChanged.push(this.galleryPhotos[index]);
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

  presentGalleryUploaderPopover() {
    if(this.galleryPhotos.length === 12) {
      this.alertService.alert('Gallery Full', 'Only 12 images per gallery maximum. Please delete a few to add more.')
    } else {
      let popover = this.popoverCtrl.create(ImageUploaderPopover, { type: 'gallery', existingPhotos: this.galleryPhotos.length }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
      popover.present();
      popover.onDidDismiss((data) => {
        if(data) {
          if(data === 'maxErr') {
            this.alertService.alert('Gallery Max Exceeded', 'Please reduce the number of images in the gallery to 12 or less');
          } else {
            data.forEach((img) => {
              this.galleryPhotos.push({
                id: null,
                galleryPhotoUrl: img.url,
                description: ''
              })
            });
          }
        }
      });
    }
  }

  presentPrimaryUploaderPopover() {
    let popover = this.popoverCtrl.create(ImageUploaderPopover, { type: 'primary' }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
    popover.present();
    popover.onDidDismiss((data) => {
      if(data) {
        this.leadPhotoLinks = data;
        this.displayedLeadPhoto = this.selectSmallLeadPhoto(this.leadPhotoLinks);
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

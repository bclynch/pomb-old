import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { ViewController, NavParams, AlertController, PopoverController, ModalController, ToastController } from 'ionic-angular';
import moment from 'moment';
import { MapsAPILoader } from '@agm/core'; // using to spin up google ready for geocoding with current location

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { AlertService } from '../../../services/alert.service';
import { UserService } from '../../../services/user.service';
import { UtilService } from '../../../services/util.service';

import { Post } from '../../../models/Post.model';
import { ImageType } from '../../../models/Image.model';
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

interface Tag {
  name: string;
  exists: boolean;
  postToTagId?: number;
}

interface PostModel {
  postTitle: string;
  postSubtitle: string;
  content: string;
  leadPhotoTitle: string;
  tripId: any;
  junctureId: number;
  city: string;
  country: string;
}

interface LeadPhoto {
  size: any;
  url: string;
}

@Component({
  selector: 'CreatePostModal',
  templateUrl: 'createPostModal.html'
})
export class CreatePostModal {

  containerOptions: string[] = ['Content', 'Options', 'Gallery'];
  activeContainerOption = 0;
  btnOptions: string[] = ['Cancel', 'Delete', 'Save'];
  postModel: PostModel = { postTitle: '', postSubtitle: '', content: '', leadPhotoTitle: '', tripId: null, junctureId: null, city: null, country: null };
  data: Post;

  // https://www.froala.com/wysiwyg-editor/docs/options#toolbarButtons
  editorOptions: Object;

  activePostOption = 1; // 2 when scheduled exists
  postOptions: PostOption[] = [
    { name: 'Published', description: 'Publish this post now', secondaryDescription: 'Publish ' },
    // { name: 'Scheduled', description: 'Publish this post in the future', secondaryDescription: 'Schedule for ' },
    { name: 'Draft', description: 'Save this post for later editing', secondaryDescription: 'This post will not be visible' }
  ];

  scheduledModel: RelativeTime = { label: 'now', value: Date.now() };
  publishModel: RelativeTime = { label: 'now', value: Date.now() };

  tagOptions: Tag[] = [];

  galleryPhotos: GalleryPhoto[] = [];
  galleryItemHasChanged: GalleryPhoto[] = [];
  leadPhotoLinks: LeadPhoto[] = [];
  displayedLeadPhoto: LeadPhoto;

  tripOptions;
  countries;
  junctureOptions = [];

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
    private userService: UserService,
    private utilService: UtilService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
    this.data = params.get('post');
    // console.log(this.data);
    // get options to populate trip + juncture selects
    this.apiService.getTripsByUser(this.userService.user.id).valueChanges.subscribe(
      result => {
        this.tripOptions = result.data.allTrips.nodes;

        // populate country options
        this.apiService.getAllCountries().valueChanges.subscribe(
          result => {
            this.countries = result.data.allCountries.nodes;
          }
        );

        if (this.data) {
          this.postModel.postTitle = this.data.title;
          this.postModel.postSubtitle = this.data.subtitle;
          this.postModel.content = this.data.content;
          this.postModel.tripId = this.data.tripId;
          if (this.postModel.tripId) {
            this.populateJunctures();
          }
          this.postModel.junctureId = this.data.junctureId;
          if (this.postModel.junctureId) {
            this.populateLocation();
          }
          this.data.postToTagsByPostId.nodes.forEach((tag) => {
            this.tagOptions.push({ name: tag.postTagByPostTagId.name, exists: true, postToTagId: tag.id });
          });
          this.leadPhotoLinks = [];
          this.galleryPhotos = [];
          this.data.imagesByPostId.nodes.forEach((img) => {
            if (img.type === ImageType['GALLERY']) {
              this.galleryPhotos.push({ id: img.id, photoUrl: img.url, description: img.description });
            } else {
              this.leadPhotoLinks.push({ url: img.url, size: null });
              this.postModel.leadPhotoTitle = img.title;
            }
          });
          this.displayedLeadPhoto = this.leadPhotoLinks[0];
          if (this.data.scheduledDate) {
            this.scheduledModel.value = +this.data.scheduledDate;
            this.scheduledModel.label = moment(+this.data.scheduledDate).fromNow();
          }
          if (this.data.publishedDate) {
            this.publishModel.value = +this.data.publishedDate;
            this.publishModel.label = moment(+this.data.publishedDate).fromNow();
          }

          this.activePostOption = this.data.isDraft ? 1 : this.data.isScheduled ? 123 : 0; // change back when scheduled is here
        }

        this.mapsAPILoader.load().then(() => {
          // geocoding ready
        });
      }
    );

    // creating custom image uploader
    $.FroalaEditor.DefineIcon('myImageUploader', { NAME: 'image' });
    const self = this;
    $.FroalaEditor.RegisterCommand('myImageUploader', {
      title: 'Upload Image',
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback: function () {
        self.presentImageUploaderPopover('post').then((data) => {
          if (data) this.html.insert(`<img src="${data[0].url}" width="${data[0].size === 800 ? '100%' : '50%'}" />`);
        });
      }
    });

    this.editorOptions = {
      placeholderText: 'Write something insightful...*',
      heightMin: '350px',
      heightMax: '525px',
      toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', '|', 'fontFamily', 'fontSize', 'color', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'myImageUploader', 'insertVideo', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo']
    };
  }

  selectSmallLeadPhoto(arr: LeadPhoto[]): LeadPhoto {
    let smallPhoto: LeadPhoto;
    arr.forEach((photo) => {
      if (photo.size === 320) smallPhoto = photo;
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

  cancelConfirm() {
    const alert = this.alertCtrl.create({
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
    const alert = this.alertCtrl.create({
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
    // validate required fields filled out if post status is scheduled or publish
    if (this.activePostOption !== 1) { // is 2 when scheduled exists
      const requiredFields: { field: any, label: string }[] = [
        { field: this.postModel.postTitle, label: 'post title' },
        { field: this.postModel.postSubtitle, label: 'post subtitle' },
        { field: this.postModel.content, label: 'post content' },
        { field: this.postModel.leadPhotoTitle, label: 'primary image title' },
        { field: this.displayedLeadPhoto, label: 'primary image' }
      ];
      for (let i = 0; i < requiredFields.length; i++) {
        if (!requiredFields[i].field) {
          this.alertService.alert('Error', `In order to publish or schedule a post all required fields must be filled out. Please check the ${requiredFields[i].label} field and try again.`);
          return;
        }
      }
    }

    // if has a post we know its a put otherwise a post
    this.data ? this.updatePost() : this.createPost();
  }

  updatePost() {
    // this.data is the original data passed in and shouldn't be mutated
    // We can use this as a ref to know if we need to pass in new edits/changes
    this.apiService.updatePostById(this.data.id, this.userService.user.id, this.postModel.postTitle, this.postModel.postSubtitle, this.postModel.content, this.postModel.tripId, this.postModel.junctureId, this.postModel.city, this.postModel.country, this.activePostOption === 1, this.activePostOption === 123, this.activePostOption === 0, this.activePostOption === 123 ? this.scheduledModel.value : null, this.activePostOption === 0 ? this.publishModel.value : null)
      .subscribe(
        result => {
          const updatePromises = [];

          // check if photos on the post have changed
          updatePromises.push(this.comparePhotos());

          // check if tags have changed. If so update post tags and or post to tags as required
          updatePromises.push(this.compareTags());

          // when all the above have resolved dismiss the modal
          Promise.all(updatePromises).then(() => {
            this.viewCtrl.dismiss();
          });
        }
      );
  }

  createPost() {
    const self = this;
    // Add most of the model to our post table
    this.apiService.createPost(this.userService.user.id, this.postModel.postTitle, this.postModel.postSubtitle, this.postModel.content, this.activePostOption === 1, this.activePostOption === 123, this.activePostOption === 0, this.postModel.tripId, this.postModel.junctureId, this.postModel.city, this.postModel.country, this.activePostOption === 123 ? this.scheduledModel.value : null, this.activePostOption === 0 ? this.publishModel.value : null)
      .subscribe(
        result => {
          const createPostData = <any>result;

          // Create lead photo
          this.createLeadPhotos(createPostData.data.createPost.post.id, this.postModel.leadPhotoTitle).then(
            () => {
              // create gallery photo links
              this.createGalleryPhotoLinks(createPostData.data.createPost.post.id, this.galleryPhotos).then(
                () => {

                  // create tags + save as required
                  this.createTagsMutation(createPostData.data.createPost.post.id, this.tagOptions).then(
                    result => this.viewCtrl.dismiss(),
                    err => createPostErrorHandler(err)
                  );
                }, err => createPostErrorHandler(err)
              );
            }
          );
        }
      );

      function createPostErrorHandler(err: Error) {
        console.log(err);
        alert('something is fucked');
        self.viewCtrl.dismiss();
      }
  }

  createLeadPhotos(postId: number, title: string) {
    return new Promise((resolve, reject) => {
      // then bulk add links to post
      if (this.leadPhotoLinks.length) {
        let query = `mutation {`;
        this.leadPhotoLinks.forEach((photo, i) => {
          query += `
            a${i}: createImage(
              input: {
                image: {
                  ${this.postModel.tripId ? 'tripId: ' + this.postModel.tripId : ''},
                  ${this.postModel.junctureId ? 'junctureId: ' + this.postModel.junctureId : ''},
                  postId: ${postId},
                  userId: ${this.userService.user.id},
                  type: ${i === 0 ? ImageType['LEAD_SMALL'] : ImageType['LEAD_LARGE']},
                  url: "${this.leadPhotoLinks[i].url}",
                  title: "${title}"
                }
              }
            ) {
              clientMutationId
            }
          `;
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
      if (!photoArr.length) resolve();

      // bulk add links to post
      let query = `mutation {`;
      photoArr.forEach((photo, i) => {
        query += `a${i}: createImage(
          input: {
            image:{
              ${this.postModel.tripId ? 'tripId: ' + this.postModel.tripId : ''},
              ${this.postModel.junctureId ? 'junctureId: ' + this.postModel.junctureId : ''},
              postId: ${postId},
              userId: ${this.userService.user.id},
              type: ${ImageType['GALLERY']},
              url: "${photo.photoUrl}",
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
      const finalTags: Tag[] = [];
      // first need to create any totally new tags and add to db
      const promiseArr = [];
      if (tagsArr.length) {
        tagsArr.forEach((tag, i) => {
          if (!tag.exists) {
            const promise = new Promise((resolve, reject) => {
              this.apiService.createPostTag(tag.name, null).subscribe(
                data => {
                  const tagData = <any>data;
                  finalTags.push({name: tagData.data.createPostTag.postTag.name, exists: true});
                  resolve();
                }
              );
            });
            promiseArr.push(promise);
          } else {
            finalTags.push(tag);
          }
        });

        Promise.all(promiseArr).then(() => {
          console.log('promise all complete');

          if (finalTags.length) {
            // then bulk add tag to post
            let query = `mutation {`;
            finalTags.forEach((tag, i) => {
              query += `a${i}: createPostToTag(
                input: {
                  postToTag:{
                    postId: ${postId},
                    postTagId: "${tag.name}"
                  }
                }
              ) {
                clientMutationId
              }
            `;
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

  compareTags(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const promiseArr = [];
      // checking for dif between arrays
      const diffExisting = this.data.postToTagsByPostId.nodes.filter(x => this.tagOptions.map((optionToSave) => optionToSave.name).indexOf(x.postTagByPostTagId.name) < 0);
      // console.log(diffExisting); // remove post to tag
      const moddedExisting = this.data.postToTagsByPostId.nodes.map((value) => value.postTagByPostTagId.name );
      const diffNew = this.tagOptions.filter(x => moddedExisting.indexOf(x.name) < 0);
      // console.log(diffNew); // create tag + post to tag

      // if no changes resolve
      if (!diffExisting.length && !diffNew.length) resolve();

      // If no diff existing
      // send these off to create tags mutation
      const promise1 = new Promise((resolve, reject) => {
        if (!diffExisting.length) {
          this.createTagsMutation(this.data.id, diffNew).then(
            result => resolve()
          );
        } else {
          resolve();
        }
      });
      promiseArr.push(promise1);

      // Has diff existing so run a for each and delete
      if (diffExisting.length) {
        const promise2 = new Promise((resolve, reject) => {
          diffExisting.forEach((tag, i) => {
            const tagData = <any>tag;
            this.apiService.deletePostToTagById(tagData.id).subscribe(
              result => {
                // console.log(result);

                // if the last tag deleted then cont
                if (i === diffExisting.length - 1) {
                  // send these off to create tags mutation
                  this.createTagsMutation(this.data.id, diffNew).then(
                    result => resolve()
                  );
                }
              }
            );
          });
        });
        promiseArr.push(promise2);
      }

      Promise.all(promiseArr).then(() => {
        resolve();
      });
    });
  }

  comparePhotos() {
    return new Promise((resolve, reject) => {
      const promiseArr = [];

      // first see if lead photos title or url changed
      let leadTitleChanged = false;
      let leadURLChanged = false;

      if (this.data.imagesByPostId.nodes[0].title !== this.postModel.leadPhotoTitle) leadTitleChanged = true;
      if (this.data.imagesByPostId.nodes[0].url !== this.leadPhotoLinks[0].url) leadURLChanged = true;

      if (leadTitleChanged || leadURLChanged) {
        // update both large and small image
        let query = `mutation {`;
        this.leadPhotoLinks.forEach((link, i) => {
          query += `a${i}: updateImageById(
            input: {
              id: ${this.data.imagesByPostId.nodes[i].id},
              imagePatch:{
                url: "${link.url}",
                title: "${this.postModel.leadPhotoTitle}"
              }
            }
          ) {
            clientMutationId
          }
        `;
        });
        query += `}`;

        const promise = new Promise((resolve, reject) => {
          this.apiService.genericCall(query).subscribe(
            result => resolve(result),
            err => console.log(err)
          );
        });
        promiseArr.push(promise);
      }

      // next check out if gallery photos are different
      const newPhotoArr: GalleryPhoto[] = this.galleryPhotos.filter((img) => !img.id );
      const promise = new Promise((resolve, reject) => {
        this.createGalleryPhotoLinks(this.data.id, newPhotoArr).then(
          result => {
            // update edited gallery photos
            // make sure 'new' photos not on 'edited' arr
            const filteredEditedArr = this.galleryItemHasChanged.filter((img => newPhotoArr.indexOf(img) === -1));
            // then bulk update imgs
            if (filteredEditedArr.length) {
              let query = `mutation {`;
              filteredEditedArr.forEach((img, i) => {
                query += `a${i}: updateImageById(
                  input: {
                    id: ${img.id},
                    imagePatch:{
                      url: "${img.photoUrl}",
                      description: "${img.description}"
                    }
                  }
                ) {
                  clientMutationId
                }
              `;
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
        );
      });
      promiseArr.push(promise);

      Promise.all(promiseArr).then(() => {
        resolve();
      });
    });
  }

  presentPopover(e) {
    const popover = this.popoverCtrl.create(PostTypePopover, { options: this.postOptions }, { cssClass: 'postTypePopover' });
    popover.present({
      ev: e
    });
    popover.onDidDismiss((data) => {
      if (data !== null) this.activePostOption = data;
    });
  }

  presentImageUploaderPopover(type: string): Promise<{ url: string, size: number }[]> {
    return new Promise((resolve, reject) => {
      const popover = this.popoverCtrl.create(ImageUploaderPopover, { type }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
      popover.present();
      popover.onDidDismiss((data) => {
        // return arr of images (in this case one)
        resolve(data);
      });
    });
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
                this.apiService.deleteImageById(this.galleryPhotos[index].id).subscribe(
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
          this.galleryItemHasChanged.push(this.galleryPhotos[index]);
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

  presentGalleryUploaderPopover() {
    if (this.galleryPhotos.length === 12) {
      this.alertService.alert('Gallery Full', 'Only 12 images per gallery maximum. Please delete a few to add more.');
    } else {
      const popover = this.popoverCtrl.create(ImageUploaderPopover, { type: 'gallery', existingPhotos: this.galleryPhotos.length, max: 12 }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
      popover.present();
      popover.onDidDismiss((data) => {
        if (data) {
          if (data === 'maxErr') {
            this.alertService.alert('Gallery Max Exceeded', 'Please reduce the number of images in the gallery to 12 or less');
          } else {
            data.forEach((img) => {
              this.galleryPhotos.push({
                id: null,
                photoUrl: img.url,
                description: ''
              });
            });
          }
        }
      });
    }
  }

  presentLeadUploaderPopover() {
    const popover = this.popoverCtrl.create(ImageUploaderPopover, { type: 'lead' }, { cssClass: 'imageUploaderPopover', enableBackdropDismiss: false });
    popover.present();
    popover.onDidDismiss((data) => {
      if (data) {
        this.leadPhotoLinks = data;
        this.displayedLeadPhoto = this.selectSmallLeadPhoto(this.leadPhotoLinks);
      }
    });
  }

  presentDatepickerModal(e: Event) {
    e.stopPropagation();

    if (this.postOptions[this.activePostOption].name !== 'Draft') {
      const modal = this.modalController.create(DatePickerModal, { date: this.postOptions[this.activePostOption].name === 'Scheduled' ? this.scheduledModel.value : this.publishModel.value }, {});
      modal.present({
        ev: e
      });
      modal.onDidDismiss((data: any) => {
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
    let exists = false;
    this.tagOptions.forEach((tag) => {
      if (tag.name === data.name) exists = true;
    });
    if (!exists) this.tagOptions.push(data);
  }

  removeTag(i: number) {
    this.tagOptions.splice(i, 1);
  }

  populateJunctures() {
    if (this.postModel.tripId !== 'null') {
      this.junctureOptions = this.tripOptions.filter((option) => {
        return option.id === +this.postModel.tripId;
      })[0].juncturesByTripId.nodes;
    } else {
      this.postModel.junctureId = null;
      this.junctureOptions = [];
    }
  }

  populateLocation() {
    const selectedJuncture = this.junctureOptions.filter((option) => {
      return option.id === +this.postModel.junctureId;
    })[0];
    this.postModel.city = selectedJuncture.city;
    this.postModel.country = selectedJuncture.country;
  }

  useCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location: any) => {
        this.apiService.reverseGeocodeCoords(location.coords.latitude, location.coords.longitude).subscribe(
          result => {
            // use zone to force update
            this.ngZone.run(() => {
              this.postModel.city = this.utilService.extractCity(result.formattedAddress.address_components);
              this.postModel.country = result.country.address_components[0].short_name;
            });
          }
        );
      });
    } else {
      this.alertService.alert('Error', 'Enable geolocation to use current location');
    }
  }
}

import { Component } from '@angular/core';
import { ModalController, ToastController, AlertController } from 'ionic-angular';

import { CreatePostModal } from '../../components/modals/createPostModal/createPostModal';

import { APIService } from '../../services/api.service';
import { RouterService } from '../../services/router.service';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { UserService } from '../../services/user.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  tabOptions: string[] = ['all', 'drafts', 'published']; // scheduled removed for now
  activeTab = 0;
  isExpanded = false;
  postsData: any;
  posts: Post[] = [];
  displayedPosts: Post[] = [];
  activePost: number = null;
  isPreview = false;
  previewedPost: Post;
  // searchQuery: string;

  constructor(
    private apiService: APIService,
    private routerService: RouterService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private userService: UserService
  ) {
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    this.settingsService.modPageMeta('Blog Dashboard', 'Create, edit, and share your own stories with Pack On My Back\'s blog generation tool. Make beautiful representations of your experiences to share and look back on.');
    this.postsData = this.apiService.getAllPostsByUser(this.userService.user.id).valueChanges.subscribe(
      ({data}) => {
        this.posts = data.allPosts.nodes;
        console.log(this.posts);
        this.displayedPosts = data.allPosts.nodes;
      });
  }

  changeTab(index: number) {
    this.activeTab = index;
    this.activePost = null;

    switch (index) {
      case 0:
        this.displayedPosts = this.posts;
        break;
      case 1:
        this.displayedPosts = this.posts.filter((post) => (post.isDraft));
        break;
      // case 2:
      // this.displayedPosts = this.posts.filter((post) => (post.isScheduled));
      //   break;
      case 2:
      this.displayedPosts = this.posts.filter((post) => (post.isPublished));
        break;
    }
  }

  launchPostEditor(post?: Post) {
    // bit of a dumb hack, but it keeps launch modal on update otherwise
    let launch = true;
    const self = this;
    if (post) {
      this.apiService.getPostById(post.id, this.userService.user.id).valueChanges.subscribe(
        result => {
          if (launch) launchModal(result.data.postById);
          launch = false;
        }
      );
    } else {
      launchModal(null);
    }

    function launchModal(post: Post) {
      const modal = self.modalCtrl.create(CreatePostModal, { post }, { cssClass: 'createPostModal', enableBackdropDismiss: false });
      modal.onDidDismiss(data => {
        if (data) {
          if (data.type === 'deleted') {
            self.deletePost(post);
          } else {
            const toast = self.toastCtrl.create({
              message: `Post ${data.title} ${data.type}`,
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        }
      });
      modal.present();
    }
  }

  deletePost(post: Post) {
    // if not post passed in it means it wasn't saved yet anyway no need for api call
    if (post) {
      this.apiService.deletePostById(post.id, this.userService.user.id).subscribe(
        result => {
          const deleteData = <any>result;
          const toast = this.toastCtrl.create({
            message: `Post "${deleteData.data.deletePostById.post.title}" successfully deleted`,
            duration: 3000,
            position: 'top'
          });

          toast.present();
        }
      );
    }
  }

  deleteConfirm(post: Post) {
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
            this.deletePost(post);
          }
        }
      ]
    });
    alert.present();
  }

  previewPost(post: Post) {
    this.apiService.getPostById(post.id, this.userService.user.id).valueChanges.subscribe(
      result => {
        this.previewedPost = result.data.postById;
        this.isPreview = true;
      }
    );
  }

  // searchPosts() {
  //   console.log(this.searchQuery);
  //   if (this.searchQuery) {
  //     this.apiService.searchPosts(this.searchQuery).valueChanges.subscribe(
  //       result => {
  //         this.posts = result.data.searchPosts.nodes;
  //         this.searchQuery = '';
  //       }
  //     );
  //   }
  // }
}

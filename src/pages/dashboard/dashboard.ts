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

  tabOptions: string[] = ['all', 'drafts', 'scheduled', 'published'];
  activeTab = 0;
  isExpanded = false;
  postsData: any;
  posts: Post[] = [];
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
    // splitting this out to be able to refetch later
    this.postsData = this.apiService.getAllPostsByUser(this.userService.user.id);
    this.postsData.valueChanges.subscribe(
      ({data}) => {
        console.log(data);
        this.posts = data.allPosts.nodes;
      });
  }

  changeTab(index: number) {
    this.activeTab = index;
    this.activePost = null;

    switch (index) {
      case 0:
        this.apiService.getAllPostsByUser(this.userService.user.id).valueChanges.subscribe(
          ({data}) => {
            this.posts = data.allPosts.nodes;
          });
        break;
      case 1:
        this.apiService.getPostsByStatus(true, false, false, this.userService.user.id).valueChanges.subscribe(
          ({data}) => {
            this.posts = data.allPosts.nodes;
          }
        );
        break;
      case 2:
        this.apiService.getPostsByStatus(false, true, false, this.userService.user.id).valueChanges.subscribe(
          ({data}) => {
            this.posts = data.allPosts.nodes;
          }
        );
        break;
      case 3:
        this.apiService.getPostsByStatus(false, false, true, this.userService.user.id).valueChanges.subscribe(
          ({data}) => {
            this.posts = data.allPosts.nodes;
          }
        );
        break;
    }
  }

  launchPostEditor(post?: Post) {
    console.log(post);
    const self = this;
    if (post) {
      this.apiService.getPostById(post.id, this.userService.user.id).valueChanges.subscribe(
        result => {
          launchModal(result.data.postById);
        }
      );
    } else {
      launchModal(null);
    }

    function launchModal(post: Post) {
      const modal = self.modalCtrl.create(CreatePostModal, { post }, { cssClass: 'createPostModal', enableBackdropDismiss: false });
      modal.onDidDismiss(data => {
        if (data === 'delete') self.deletePost(post);
        // causing weird behavior where it reopens modal
        // if (data === 'refresh') self.postsData.refetch();
      });
      modal.present();
    }
  }

  deletePost(post: Post) {
    // if not post passed in it means it wasn't saved yet anyway no need for api call
    if (post) {
      this.apiService.deletePostById(post.id).subscribe(
        result => {
          const deleteData = <any>result;
          const toast = this.toastCtrl.create({
            message: `Post "${deleteData.data.deletePostById.post.title}" successfully deleted`,
            duration: 3000,
            position: 'top'
          });

          toast.present();

          this.postsData.refetch();
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
        console.log(result);
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

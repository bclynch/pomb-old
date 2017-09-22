import { Component } from '@angular/core';
import { ModalController, ToastController, AlertController } from 'ionic-angular';

import { CreatePostModal } from '../../components/modals/createPostModal/createPostModal';

import { APIService } from '../../services/api.service';
import { RouterService } from '../../services/router.service';
import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  tabOptions: string[] = ['all', 'drafts', 'scheduled', 'published'];
  activeTab: number = 0;
  isExpanded: boolean = false;
  postsData: any;
  posts: Post[] = []; 
  activePost: number = null;

  constructor(
    private apiService: APIService,
    private routerService: RouterService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private settingsService: SettingsService,
    private broadcastService: BroadcastService
  ) {  
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    //splitting this out to be able to refetch later
    this.postsData = this.apiService.getAllPosts();
    this.postsData.subscribe(
      ({data}) => {
        console.log(data);
        this.posts = data.allPosts.nodes;
      });
  }

  changeTab(index: number) {
    this.activeTab = index;
    this.activePost = null;

    switch(index) {
      case 0:
        this.apiService.getAllPosts().subscribe(
          ({data}) => {
            this.posts = data.allPosts.nodes;
          });
        break;
      case 1:
        this.apiService.getPostsByStatus(true, false, false).subscribe(
          ({data}) => {
            this.posts = data.allPosts.nodes;
          }
        )
        break;
      case 2:
        this.apiService.getPostsByStatus(false, true, false).subscribe(
          ({data}) => {
            this.posts = data.allPosts.nodes;
          }
        )
        break;
      case 3:
        this.apiService.getPostsByStatus(false, false, true).subscribe(
          ({data}) => {
            this.posts = data.allPosts.nodes;
          }
        )
        break;
    }
  }

  launchPostEditor(post?: Post) {
    let modal = this.modalCtrl.create(CreatePostModal, {post}, { cssClass: 'createPostModal', enableBackdropDismiss: false });
    modal.onDidDismiss(data => {
      if(data === 'delete') this.deletePost(post);
      if(data === 'refresh') this.postsData.refetch();
    });
    modal.present(); 
  }

  deletePost(post: Post) {
    //if not post passed in it means it wasn't saved yet anyway no need for api call
    if(post) {
      this.apiService.deletePostById(post.id).subscribe(
        result => {
          const deleteData = <any>result;
          let toast = this.toastCtrl.create({
            message: `Post "${deleteData.data.deletePostById.post.title}" successfully deleted`,
            duration: 3000,
            position: 'top'
          }); 
      
          toast.present();
  
          this.postsData.refetch();
        }
      )
    }
  }

  deleteConfirm(post: Post) {
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
            this.deletePost(post);
          }
        }
      ]
    });
    alert.present();
  }
}

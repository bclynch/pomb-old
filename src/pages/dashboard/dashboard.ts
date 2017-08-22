import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { CreatePostModal } from '../../components/modals/createPostModal/createPostModal';

import { APIService } from '../../services/api.service';
import { RouterService } from '../../services/router.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage implements OnInit {

  tabOptions: string[] = ['all', 'drafts', 'scheduled', 'published'];
  activeTab: number = 0;
  postPreviewModel: string = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>';
  isExpanded: boolean = false;
  posts: Post[] = []; 
  activePost: number = null;

  constructor(
    private apiService: APIService,
    private routerService: RouterService,
    private modalCtrl: ModalController
  ) {  }

  ngOnInit() {
    this.apiService.getAllPosts().subscribe(
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
            console.log(data);
            this.posts = data.allPosts.nodes;
          });
        break;
      case 1:
        this.apiService.getPostsByStatus(true, false, false).subscribe(
          ({data}) => {
            console.log(data);
            this.posts = data.allPosts.nodes;
          }
        )
        break;
      case 2:
        this.apiService.getPostsByStatus(false, true, false).subscribe(
          ({data}) => {
            console.log(data);
            this.posts = data.allPosts.nodes;
          }
        )
        break;
      case 3:
        this.apiService.getPostsByStatus(false, false, true).subscribe(
          ({data}) => {
            console.log(data);
            this.posts = data.allPosts.nodes;
          }
        )
        break;
    }
  }

  launchPostEditor(post?: Post) {
    let modal = this.modalCtrl.create(CreatePostModal, {post}, {cssClass: 'createPostModal', enableBackdropDismiss: false});
    modal.present(); 
  }
}

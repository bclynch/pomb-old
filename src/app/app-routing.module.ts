import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { PageNotFoundComponent } from './not-found.component';

//pages
import { HomePage } from '../pages/home/home';
import { PostPage } from '../pages/post/post';
import { PostCreator } from '../pages/postCreator/postCreator';
import { HubPage } from '../pages/hub/hub';

const appRoutes: Routes = [
  { 
    path: 'post',
    children: [
      {
        path: ':id',
        children: [
          {
            path: ':title',
            component: PostPage
          }
        ]
      }
    ]
  },
  { path: 'trekking', component: HubPage},
  { path: 'biking', component: HubPage},
  { path: 'culture', component: HubPage},
  { path: 'food', component: HubPage},
  { path: 'gear', component: HubPage},
  { path: 'create-post', component: PostCreator },
  { path: '',   component: HomePage },
  { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
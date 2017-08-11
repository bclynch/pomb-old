import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { PageNotFoundComponent } from './not-found.component';

//pages
import { HomePage } from '../pages/home/home';
import { PostPage } from '../pages/post/post';
import { PostCreator } from '../pages/postCreator/postCreator';

const appRoutes: Routes = [
  { path: 'post',
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
import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { PageNotFoundComponent } from './not-found.component';

import { RoleGuardService as RoleGuard } from '../services/roleGuard.service';

//pages
import { HomePage } from '../pages/home/home';
import { PostPage } from '../pages/post/post';
import { HubPage } from '../pages/hub/hub';
import { ProfilePage } from '../pages/profile/profile';
import { FavoritesPage } from '../pages/favorites/favorites';
import { SettingsPage } from '../pages/settings/settings';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SearchResultsPage } from '../pages/searchResults/searchResults';
import { ArchivePage } from '../pages/archive/archive';
import { AdminPage } from '../pages/admin/admin';
import { ExplorePage } from '../pages/explore/explore';
import { ExploreRegionPage } from '../pages/explore/region/explore.region';
import { ExploreCountryPage } from '../pages/explore/country/explore.country';
import { ExploreCityPage } from '../pages/explore/city/explore.city';
import { CommunityPage } from '../pages/community/community';
import { UserAdminPage } from '../pages/userAdmin/admin';
import { TripPage } from '../pages/trip/trip';

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
  { path: 'travel', component: HubPage},
  { path: 'gear', component: HubPage},
  { path: 'explore',
    children: [
      {
        path: 'region',
        children: [
          {
            path: ':region',
            component: ExploreRegionPage
          },
          {
            path: '',
            component: ExplorePage
          }
        ]
      },
      {
        path: 'country',
        children: [
          {
            path: ':country',
            children: [
              {
                path: ':city',
                component: ExploreCityPage
              },
              {
                path: '',
                component: ExploreCountryPage
              }
            ]
          },
          {
            path: '',
            component: ExplorePage
          }
        ]
      },
      {
        path: '',
        component: ExplorePage
      }
  ]},
  { path: 'archive', component: ArchivePage },
  { path: 'admin',
  // canActivate: [RoleGuard], 
  // data: { 
  //   expectedRole: 'pomb_admin'
  // },
    children: [
      {
        path: '',
        component: AdminPage
      },
      {
        path: ':id',
        children: [
          {
              path: 'dashboard',
              component: AdminPage
          },
          {
              path: 'config',
              component: AdminPage
          },
          {
              path: 'users',
              component: AdminPage
          },
          {
              path: 'posts',
              component: AdminPage
          }
        ]
      }
    ]
  },
  {
    path: ':username',
    children: [
      {
        path: '',
        component: ProfilePage
      },
      {
        path: 'admin',
        canActivate: [RoleGuard], 
        data: { 
          expectedRole: 'pomb_account'
        },
        component: UserAdminPage
      },
      { 
        path: 'post-dashboard',
        canActivate: [RoleGuard], 
        data: { 
          expectedRole: 'pomb_account'
        },
        component: DashboardPage
      },
      {
        path: 'trip',
        children: [
          {
            path: ':id',
            component: TripPage
          }
        ]
      }
    ]
  },
  { path: 'community', component: CommunityPage },
  { path: 'profile', component: ProfilePage },
  { path: 'favorites', component: FavoritesPage },
  { path: 'settings', component: SettingsPage },
  { path: 'search', component: SearchResultsPage },
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
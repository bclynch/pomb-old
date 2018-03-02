import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleGuardService as RoleGuard } from '../services/roleGuard.service';
import { SplashGuardService as SplashGuard } from '../services/splashGuard.service';

// pages
import { HomePage } from '../pages/home/home';
import { PostPage } from '../pages/post/post';
import { HubPage } from '../pages/hub/hub';
import { ProfilePage } from '../pages/profile/profile';
import { FavoritesPage } from '../pages/favorites/favorites';
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
import { TripMapPage } from '../pages/tripMap/tripMap';
import { TripTimelinePage } from '../pages/tripTimeline/tripTimeline';
import { JuncturePage } from '../pages/juncture/juncture';
import { PhotosPage } from '../pages/photos/photos';
import { NotFoundPage } from '../pages/error/404/404';
import { GeneralErrorPage } from '../pages/error/general/general';
import { SplashPage } from '../pages/splash/splash';
import { TrackingPage } from '../pages/tracking/tracking';
import { ResetPage } from '../pages/reset/reset';
import { ConstructionPage } from '../pages/construction/construction';
import { ContactPage } from '../pages/contact/contact';
import { AboutPage } from '../pages/about/about';
import { TermsPage } from '../pages/terms/terms';
import { AdminLoginPage } from '../pages/adminLogin/adminLogin';

const appRoutes: Routes = [
  {
    path: 'stories',
    children: [
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
      {
        path: ':tag',
        children: [
          {
            path: '',
            component: HubPage
          }
        ]
      },
      {
        path: '',
        component: HomePage
      }
    ]
  },
  { path: 'community', component: TrackingPage }, // don't have one
  { path: 'explore',
    children: [
      {
        path: 'region',
        children: [
          {
            path: ':region',
            children: [
              {
                path: '',
                component: ExploreRegionPage
              },
              {
                path: ':subregion',
                component: ExploreRegionPage
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
  {
    path: 'archive',
    children: [
      {
        path: ':page',
        component: ArchivePage
      },
      {
        path: '',
        component: ArchivePage
      }
    ]
  },
  { path: 'admin',
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'pomb_admin'
    },
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
    path: 'trip',
    children: [
      {
        path: ':tripId',
        children: [
          {
            path: '',
            component: TripPage
          },
          {
            path: 'map',
            component: TripMapPage
          },
          {
            path: 'posts',
            component: HubPage
          },
          {
            path: 'junctures',
            component: TripTimelinePage
          },
          {
            path: 'photos',
            component: PhotosPage
          },
        ]
      }
    ]
  },
  {
    path: 'juncture',
    children: [
      {
        path: ':id',
        component: JuncturePage
      }
    ]
  },
  { path: 'search', component: SearchResultsPage },
  { path: 'community', component: CommunityPage },
  {
    path: 'user',
    children: [
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
        path: ':username',
        children: [
          {
            path: '',
            component: ProfilePage
          },
          {
            path: 'photos',
            component: PhotosPage
          }
        ]
      },
    ]
  },
  { path: 'reset', component: ResetPage },
  { path: 'contact', component: ContactPage },
  { path: 'about', component: AboutPage },
  { path: 'admin-login', component: AdminLoginPage },
  { path: 'terms', component: TermsPage },
  { path: 'construction', component: ConstructionPage },
  {
    path: 'tracking',
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'pomb_account'
    },
    component: TrackingPage
  },
  {
    path: '',
    component: SplashPage,
    canActivate: [SplashGuard]
  },
  { path: 'error', component: GeneralErrorPage },
  { path: '**', component: NotFoundPage }
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

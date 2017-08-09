import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { PageNotFoundComponent } from './not-found.component';

//pages
import { HomePage } from '../pages/home/home';

// import { HomePage } from '../pages/home/home';
// import { MainPage } from '../pages/main/main';
// import { SegmentPage } from '../pages/segment/segment';
// import { AssetPage } from '../pages/asset/asset';
// import { GroupsPage } from '../pages/groups/groups';
// import { LibraryPage } from '../pages/library/library';
// import { FolderPage } from '../pages/folder/folder';
// import { SettingsPage } from '../pages/settings/settings';
// import { SearchResultsPage } from '../pages/searchResults/searchResults';
// import { GenericPage } from '../pages/generic/generic';

// import { AuthGuardService } from '../services/authguard.service';

const appRoutes: Routes = [
  { path: '',   component: HomePage },
  { path: '**', component: PageNotFoundComponent }
];

// const appRoutes: Routes = [
//   { 
//     path: 'main',
//     canActivate: [AuthGuardService], 
//     children: [
//       {
//         path: '',
//         component: MainPage,
//         canActivateChild: [AuthGuardService]
//       },
//       {
//         path: 'segment',
//         children: [
//           { 
//             path: ':item',
//             children: [
//               {
//                 path: '',
//                 component: SegmentPage
//               },
//               {
//                 path: 'asset',
//                 children: [
//                   {
//                     path: ':item',
//                     component: AssetPage
//                   }
//                 ]
//               },
//               {
//                 path: 'folder',
//                 children: [
//                   {
//                     path: ':item',
//                     children: [
//                       {
//                         path: '',
//                         component: FolderPage
//                       },
//                       {
//                         path: 'asset',
//                         children: [
//                           {
//                             path: ':item',
//                             component: AssetPage
//                           }
//                         ]
//                       },
//                       {
//                     path: 'search',
//                       component: SearchResultsPage
//                     }
//                     ]
//                   },
//                   {
//                     path: 'search',
//                     component: SearchResultsPage
//                   }
//                 ]
//               },
//               {
//                 path: 'search',
//                 component: SearchResultsPage
//               },
//               {
//                 path: 'recent',
//                 component: GenericPage
//               },
//               {
//                 path: 'all',
//                 component: GenericPage
//               }
//             ]
//           }
//         ]
//       },
//       {
//         path: 'search',
//         component: SearchResultsPage
//       }
//     ]
//   },
//   {
//     path: 'library',
//     canActivate: [AuthGuardService],  
//     children: [
//       {
//         path: '',
//         component: LibraryPage,
//         canActivateChild: [AuthGuardService]
//       },
//       {
//         path: 'asset',
//         children: [
//           {
//             path: ':item',
//             component: AssetPage
//           }
//         ]
//       },
//       {
//         path: 'folder',
//         children: [
//           { 
//             path: ':item',
//             children: [
//               {
//                 path: '',
//                 component: FolderPage
//               },
//               {
//                 path: 'asset',
//                 children: [
//                   {
//                     path: ':item',
//                     component: AssetPage
//                   }
//                 ]
//               },
//               {
//                 path: 'search',
//                 component: SearchResultsPage
//               }
//             ]
//           },
//           {
//             path: 'search',
//             component: SearchResultsPage
//           }
//         ]
//       },
//       {
//         path: 'search',
//         component: SearchResultsPage
//       }
//     ]
//   },
//   { 
//     path: 'groups', 
//     canActivate: [AuthGuardService], 
//     children: [
//       {
//         path: '',
//         component: GroupsPage,
//         canActivateChild: [AuthGuardService]
//       },
//       {
//         path: 'asset',
//         children: [
//           {
//             path: ':item',
//             component: AssetPage
//           }
//         ]
//       },
//       {
//         path: 'group',
//         children: [
//           {
//             path: ':item',
//             children: [
//               {
//                 path: '',
//                 component: FolderPage
//               },
//               {
//                 path: 'asset',
//                 children: [
//                   {
//                     path: ':item',
//                     component: AssetPage
//                   }
//                 ]
//               },
//               {
//                 path: 'search',
//                 component: SearchResultsPage
//               }
//             ]
//           },
//           {
//             path: 'search',
//             component: SearchResultsPage
//           }
//         ]
//       },
//       {
//         path: 'search',
//         component: SearchResultsPage
//       }
//     ]
//   },
//   { path: 'settings', component: SettingsPage },
//   { path: '',   component: HomePage },
//   { path: '**', component: PageNotFoundComponent }
// ];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
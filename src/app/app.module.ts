import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { getClient } from './client';

// 3rd Party Libraries
import { ApolloModule } from 'apollo-angular';
import { AgmCoreModule } from '@agm/core';
import "froala-editor/js/froala_editor.pkgd.min.js";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

// App
import { MyApp } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Components
import { PageNotFoundComponent } from './not-found.component';
import { Grid } from '../components/grid/grid.component';
import { GridCard } from '../components/gridCard/gridCard.component';
import { HeroBanner } from '../components/heroBanner/heroBanner.component';
import { NavBar } from '../components/navBar/navBar.component';
import { CompactHero } from '../components/compactHero/compactHero.component';
import { PageWrapper } from '../components/pageWrapper/pageWrapper.component';
import { PostCard } from '../components/postCard/postCard.component';
import { PostList } from '../components/postList/postList.component';
import { Footer } from '../components/footer/footer.component';
import { DashboardCard } from '../components/dashboardCard/dashboardCard.component';
import { PostWrapper } from '../components/postWrapper/postWrapper.component';
import { Search } from '../components/search/search';
import { TagSearch } from '../components/tagSearch/tagSearch.component';

// Popovers
import { ProfilePopover } from '../components/popovers/profile/profilePopover.component';
import { PostTypePopover } from '../components/popovers/postType/postTypePopover.component';

// Modals
import { RegistrationModal } from '../components/modals/registrationModal/registrationModal';
import { CreatePostModal } from '../components/modals/createPostModal/createPostModal';

// Pages
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
import { AdminDashboardPage } from '../pages/admin/subViews/dashboard/dashboard';
import { AdminConfigPage } from '../pages/admin/subViews/config/config';
import { AdminUsersPage } from '../pages/admin/subViews/users/users';
import { AdminPostsPage } from '../pages/admin/subViews/posts/posts';

// Services
import { APIService } from '../services/api.service';
import { LocalStorageService } from '../services/localStorage.service';
import { UserService } from '../services/user.service';
import { CacheService } from '../services/cache.service';
import { SettingsService } from '../services/settings.service';
import { RouterService } from '../services/router.service';
import { AlertService } from '../services/alert.service';
import { BroadcastService } from '../services/broadcast.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PostPage,
    HubPage,
    ProfilePage,
    FavoritesPage,
    SettingsPage,
    DashboardPage,
    SearchResultsPage,
    ArchivePage,
    AdminPage,
    PageNotFoundComponent,
    Grid,
    GridCard,
    HeroBanner,
    NavBar,
    CompactHero,
    PageWrapper,
    PostCard,
    PostList,
    ProfilePopover,
    RegistrationModal,
    Footer,
    DashboardCard,
    PostWrapper,
    CreatePostModal,
    PostTypePopover,
    Search,
    TagSearch,
    AdminDashboardPage,
    AdminConfigPage,
    AdminUsersPage,
    AdminPostsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    IonicModule.forRoot(MyApp),
    ApolloModule.withClient(getClient),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC4sPLxEvc3uaQmlEpE81QQ5aY_1hytMEA', //this.envVariables.googlePlacesKey Need to figure this our eventually THIS IS THE LAZE KEY
    }),
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PostPage,
    HubPage,
    ProfilePage,
    FavoritesPage,
    SettingsPage,
    DashboardPage,
    SearchResultsPage,
    ArchivePage,
    AdminPage,
    PageNotFoundComponent,
    ProfilePopover,
    RegistrationModal,
    CreatePostModal,
    PostTypePopover
  ],
  providers: [
    APIService,
    LocalStorageService,
    UserService,
    SettingsService,
    RouterService,
    AlertService,
    BroadcastService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

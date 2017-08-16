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
import { ContentWrapper } from '../components/contentWrapper/contentWrapper.component';
import { PostCard } from '../components/postCard/postCard.component';
import { PostList } from '../components/postList/postList.component';

// Pages
import { HomePage } from '../pages/home/home';
import { PostPage } from '../pages/post/post';
import { PostCreator } from '../pages/postCreator/postCreator';
import { HubPage } from '../pages/hub/hub';

// Services
import { APIService } from '../services/api.service';
import { LocalStorageService } from '../services/localStorage.service';
import { UserService } from '../services/user.service';
import { CacheService } from '../services/cache.service';
import { SettingsService } from '../services/settings.service';
import { RouterService } from '../services/router.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PostPage,
    PostCreator,
    HubPage,
    PageNotFoundComponent,
    Grid,
    GridCard,
    HeroBanner,
    NavBar,
    CompactHero,
    PageWrapper,
    ContentWrapper,
    PostCard,
    PostList,
    
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
    PostCreator,
    HubPage,
    PageNotFoundComponent
  ],
  providers: [
    APIService,
    LocalStorageService,
    UserService,
    SettingsService,
    RouterService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

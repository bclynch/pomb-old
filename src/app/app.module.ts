import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ApolloModule } from 'apollo-angular';
import { AgmCoreModule } from '@agm/core';
import { getClient } from './client';

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

// Pages
import { HomePage } from '../pages/home/home';

// Services
import { APIService } from '../services/api.service';
import { LocalStorageService } from '../services/localStorage.service';
import { UserService } from '../services/user.service';
import { CacheService } from '../services/cache.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PageNotFoundComponent,
    Grid,
    GridCard,
    HeroBanner,
    NavBar,
    CompactHero
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    IonicModule.forRoot(MyApp),
    ApolloModule.withClient(getClient),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC4sPLxEvc3uaQmlEpE81QQ5aY_1hytMEA', //this.envVariables.googlePlacesKey Need to figure this our eventually THIS IS THE LAZE KEY
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PageNotFoundComponent
  ],
  providers: [
    APIService,
    LocalStorageService,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

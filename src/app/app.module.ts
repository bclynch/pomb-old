import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// App
import { MyApp } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Components
import { PageNotFoundComponent } from './not-found.component';
import { Grid } from '../components/grid/grid.component';
import { GridCard } from '../components/gridCard/gridCard.component';
import { HeroBanner } from '../components/heroBanner/heroBanner.component';
import { NavBar } from '../components/navBar/navBar.component';

// Pages
import { HomePage } from '../pages/home/home';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PageNotFoundComponent,
    Grid,
    GridCard,
    HeroBanner,
    NavBar
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PageNotFoundComponent
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

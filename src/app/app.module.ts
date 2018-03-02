import { BrowserModule, HAMMER_GESTURE_CONFIG, Title } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
// import { getClient } from './client';
import { MyHammerConfig } from './touchConfig';

// 3rd Party Libraries
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloModule, Apollo } from 'apollo-angular';
import { setContext } from 'apollo-link-context';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { ShareButtonsModule } from 'ngx-sharebuttons';
import { DisqusModule } from 'ngx-disqus';

// App
import { PackOnMyBack } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GlobalErrorHandler } from './app.globalErrorHandler';

// Directives
import { WindowScrollDirective } from '../directives/scroll.directive';
import { EqualValidator } from '../directives/validatePassword.directive';

// Pipes
import { TruncatePipe } from '../pipes/truncate.pipe';

// Components
import { Grid } from '../components/grid/grid.component';
import { GridCard } from '../components/grid/gridCard/gridCard.component';
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
import { Gallery } from '../components/gallery/gallery.component';
import { GalleryCard } from '../components/gallery/galleryCard/galleryCard.component';
import { ExpandedModal } from '../components/gallery/expandedModal/expandedModal.component';
import { GoogleChartComponent } from '../components/charts/geoChart.component';
import { FadeCarousel } from '../components/fadeCarousel/fadeCarousel.component';
import { ExploreSubnav } from '../components/exploreSubnav/exploreSubnav.component';
import { MyPackNavSection } from '../components/navBar/paneSections/myPack/myPackSection.component';
import { StoriesNavSection } from '../components/navBar/paneSections/stories/storiesSection.component';
import { ExploreNavSection } from '../components/navBar/paneSections/explore/exploreSection.component';
import { CommunityNavSection } from '../components/navBar/paneSections/community/communitySection.component';
import { ProfileHeroBanner } from '../components/profileHeroBanner/profileHeroBanner.component';
import { TripCard } from '../components/tripCard/tripCard.component';
import { BackpackIcon } from '../components/svgs/backpack/backpack.component';
import { TrackIcon } from '../components/svgs/track/track.component';
import { PlaceGuide } from '../components/placeGuide/placeGuide.component';
import { ShareBtns } from '../components/shareBtns/shareBtns.component';
import { UploadGPX } from '../components/uploadGPX/uploadGPX.component';
import { ChartComponent } from '../components/chart/chart.component';
import { Newsletter } from '../components/newsletter/newsletter.component';
import { UnitToggle } from '../components/unitToggle/unitToggle.component';
import { Tags } from '../components/tags/tags.component';
import { JunctureBubbles } from '../components/junctureBubbles/junctureBubbles.component';
import { JunctureBubble } from '../components/junctureBubbles/junctureBubble/junctureBubble.component';
import { ProfilePicture } from '../components/profilePicture/profilePicture.component';
import { LikeCounter } from '../components/likeCounter/likeCounter.component';
import { TrackUser } from '../components/trackUser/trackUser.component';
import { CountrySearch } from '../components/countrySearch/countrySearch.component';

// Popovers
import { PostTypePopover } from '../components/popovers/postType/postTypePopover.component';
import { GradientPopover } from '../components/popovers/gradient/gradientPopover.component';
import { ImageUploaderPopover } from '../components/popovers/imageUploader/imageUploaderPopover.component';
import { GalleryImgActionPopover } from '../components/popovers/galleryImgAction/galleryImgActionPopover.component';
import { JunctureSaveTypePopover } from '../components/popovers/junctureSaveType/junctureSaveTypePopover.component';

// Modals
import { RegistrationModal } from '../components/modals/registrationModal/registrationModal';
import { CreatePostModal } from '../components/modals/createPostModal/createPostModal';
import { DatePickerModal } from '../components/modals/datepickerModal/datepickerModal';
import { ExploreModal } from '../components/modals/exploreModal/exploreModal';
import { JunctureModal } from '../components/modals/junctureModal/junctureModal';
import { TripModal } from '../components/modals/tripModal/tripModal';
import { MobileNavModal } from '../components/modals/mobileNavModal/mobileNavModal';
import { DeleteAccountModal } from '../components/modals/deleteAccountModal/deleteAccountModal';

// Pages
import { HomePage } from '../pages/home/home';
import { PostPage } from '../pages/post/post';
import { HubPage } from '../pages/hub/hub';
import { ProfilePage } from '../pages/profile/profile';
import { FavoritesPage } from '../pages/favorites/favorites';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SearchResultsPage } from '../pages/searchResults/searchResults';
import { ArchivePage } from '../pages/archive/archive';
import { AdminPage } from '../pages/admin/admin';
import { AdminDashboardPage } from '../pages/admin/subViews/dashboard/dashboard';
import { AdminConfigPage } from '../pages/admin/subViews/config/config';
import { AdminUsersPage } from '../pages/admin/subViews/users/users';
import { AdminPostsPage } from '../pages/admin/subViews/posts/posts';
import { UserAdminPage } from '../pages/userAdmin/admin';
import { UserAdminDashboardPage } from '../pages/userAdmin/subViews/dashboard/dashboard';
import { UserAdminConfigPage } from '../pages/userAdmin/subViews/config/config';
import { UserAdminTripsPage } from '../pages/userAdmin/subViews/trips/trips';
import { UserAdminSettingsPage } from '../pages/userAdmin/subViews/settings/settings';
import { ExplorePage } from '../pages/explore/explore';
import { ExploreRegionPage } from '../pages/explore/region/explore.region';
import { ExploreCountryPage } from '../pages/explore/country/explore.country';
import { ExploreCityPage } from '../pages/explore/city/explore.city';
import { CommunityPage } from '../pages/community/community';
import { TripPage } from '../pages/trip/trip';
import { TripMapPage } from '../pages/tripMap/tripMap';
import { JuncturePage } from '../pages/juncture/juncture';
import { TripTimelinePage } from '../pages/tripTimeline/tripTimeline';
import { PhotosPage } from '../pages/photos/photos';
import { SplashPage } from '../pages/splash/splash';
import { TrackingPage } from '../pages/tracking/tracking';
import { ResetPage } from '../pages/reset/reset';
import { ConstructionPage } from '../pages/construction/construction';
import { ContactPage } from '../pages/contact/contact';
import { AboutPage } from '../pages/about/about';
import { TermsPage } from '../pages/terms/terms';
import { AdminLoginPage } from '../pages/adminLogin/adminLogin';
import { NotFoundPage } from '../pages/error/404/404';
import { GeneralErrorPage } from '../pages/error/general/general';

// Services
import { APIService } from '../services/api.service';
import { LocalStorageService } from '../services/localStorage.service';
import { UserService } from '../services/user.service';
import { CacheService } from '../services/cache.service';
import { SettingsService } from '../services/settings.service';
import { RouterService } from '../services/router.service';
import { AlertService } from '../services/alert.service';
import { BroadcastService } from '../services/broadcast.service';
import { RoleGuardService } from '../services/roleGuard.service';
import { SplashGuardService } from '../services/splashGuard.service';
import { ExploreService } from '../services/explore.service';
import { UtilService } from '../services/util.service';
import { JunctureService } from '../services/juncture.service';
import { TripService } from '../services/trip.service';
import { GeoService } from '../services/geo.service';
import { ErrorService } from '../services/error.service';
import { AnalyticsService } from '../services/analytics.service';

@NgModule({
  declarations: [
    PackOnMyBack,
    HomePage,
    PostPage,
    HubPage,
    ProfilePage,
    FavoritesPage,
    DashboardPage,
    SearchResultsPage,
    ArchivePage,
    AdminPage,
    UserAdminPage,
    Grid,
    GridCard,
    HeroBanner,
    NavBar,
    CompactHero,
    PageWrapper,
    PostCard,
    PostList,
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
    AdminPostsPage,
    UserAdminDashboardPage,
    UserAdminConfigPage,
    UserAdminTripsPage,
    UserAdminSettingsPage,
    GradientPopover,
    DatePickerModal,
    ImageUploaderPopover,
    GalleryImgActionPopover,
    Gallery,
    GalleryCard,
    ExpandedModal,
    GoogleChartComponent,
    ExplorePage,
    ExploreRegionPage,
    ExploreCountryPage,
    ExploreCityPage,
    FadeCarousel,
    ExploreModal,
    WindowScrollDirective,
    EqualValidator,
    CommunityPage,
    ExploreSubnav,
    MyPackNavSection,
    StoriesNavSection,
    ExploreNavSection,
    CommunityNavSection,
    ProfileHeroBanner,
    TripCard,
    TripPage,
    JunctureModal,
    BackpackIcon,
    JunctureSaveTypePopover,
    TripModal,
    MobileNavModal,
    PlaceGuide,
    ShareBtns,
    UploadGPX,
    JuncturePage,
    TripMapPage,
    ChartComponent,
    Newsletter,
    TripTimelinePage,
    TruncatePipe,
    UnitToggle,
    PhotosPage,
    SplashPage,
    NotFoundPage,
    GeneralErrorPage,
    Tags,
    JunctureBubbles,
    JunctureBubble,
    ProfilePicture,
    LikeCounter,
    ResetPage,
    DeleteAccountModal,
    TrackUser,
    TrackingPage,
    TrackIcon,
    CountrySearch,
    ConstructionPage,
    ContactPage,
    AboutPage,
    TermsPage,
    AdminLoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    IonicModule.forRoot(PackOnMyBack),
    HttpClientModule,
    HttpLinkModule,
    ApolloModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC4sPLxEvc3uaQmlEpE81QQ5aY_1hytMEA', // this.envVariables.googlePlacesKey Need to figure this our eventually THIS IS THE LAZE KEY
    }),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    AgmSnazzyInfoWindowModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    ShareButtonsModule.forRoot(),
    DisqusModule.forRoot('packonmyback')
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PackOnMyBack,
    HomePage,
    PostPage,
    HubPage,
    ProfilePage,
    FavoritesPage,
    DashboardPage,
    SearchResultsPage,
    ArchivePage,
    AdminPage,
    UserAdminPage,
    RegistrationModal,
    CreatePostModal,
    PostTypePopover,
    GradientPopover,
    DatePickerModal,
    ImageUploaderPopover,
    GalleryImgActionPopover,
    ExpandedModal,
    ExplorePage,
    ExploreRegionPage,
    ExploreCountryPage,
    ExploreCityPage,
    ExploreModal,
    CommunityPage,
    TripPage,
    JunctureModal,
    JunctureSaveTypePopover,
    TripModal,
    MobileNavModal,
    JuncturePage,
    TripMapPage,
    TripTimelinePage,
    PhotosPage,
    SplashPage,
    NotFoundPage,
    GeneralErrorPage,
    ResetPage,
    DeleteAccountModal,
    TrackingPage,
    ConstructionPage,
    ContactPage,
    AboutPage,
    TermsPage,
    AdminLoginPage
  ],
  providers: [
    APIService,
    LocalStorageService,
    UserService,
    SettingsService,
    RouterService,
    AlertService,
    BroadcastService,
    RoleGuardService,
    SplashGuardService,
    ExploreService,
    UtilService,
    JunctureService,
    TripService,
    GeoService,
    Title,
    ErrorService,
    AnalyticsService,
    {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig},
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ]
})
export class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const http = httpLink.create({ uri: 'graphql' }); // prod --> /api/graphql dev --> http://localhost:5000/graphql

    let link;
    let user: any = localStorage.getItem('pomb-user');
    if (user && user !== 'null') {
      user = JSON.parse(user);
      const middleware = setContext(() => ({
        headers: new HttpHeaders().set('Authorization', user.token ? `Bearer ${user.token}` : null)
      }));

      link = middleware.concat(http);
    } else {
      link = http;
    }

    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
}

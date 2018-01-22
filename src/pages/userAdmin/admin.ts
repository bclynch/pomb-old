import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from 'ionic-angular';
import {Apollo} from 'apollo-angular';

// import { DashboardService } from '../../../services/dashboard.service';
import { UserService } from '../../services/user.service';
import { BroadcastService } from '../../services/broadcast.service';
import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';

interface ListOption {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'page-useradmin',
  templateUrl: 'admin.html'
})
export class UserAdminPage {

  navListOptions: ListOption[] = [
    {label: 'Dashboard', icon: 'md-pulse', path: 'dashboard'},
    {label: 'Trips', icon: 'md-plane', path: 'trips'},
    {label: 'Posts', icon: 'md-filing', path: 'posts'},
    {label: 'Configuration', icon: 'md-hammer', path: 'config'},
    {label: 'Log Out', icon: 'log-out', path: null}
  ];
  activeDashView: string;
  storeId: number;
  displayMenuToggle = true;
  dataReady = false;

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private userService: UserService,
    private apollo: Apollo,
    private broadcastService: BroadcastService,
    private settingsService: SettingsService,
    private routerService: RouterService
  ) {
    this.activeDashView = this.routerService.fragment || 'dashboard';
    this.dataReady = true;
    this.settingsService.appInited ? console.log('fuck off') : this.broadcastService.on('appIsReady', () => console.log('fuck off'));
    this.settingsService.modPageTitle('User Admin Dashboard');
  }

  openMenu() {
    this.menuCtrl.open();
  }

  navigate(path) {
    if (path) {
      this.routerService.modifyFragment(path);
      this.activeDashView = path;
      this.menuCtrl.close();
    } else {
      this.userService.signedIn = false;
      // reset apollo cache and refetch queries
      this.apollo.getClient().resetStore();
      localStorage.removeItem('pomb-user');
      this.router.navigateByUrl(`/`);
      window.location.reload();
    }
  }

  menuBtnState(state) {
    this.displayMenuToggle = state;
  }
}

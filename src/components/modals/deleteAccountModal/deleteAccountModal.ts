import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Apollo } from 'apollo-angular';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { UserService } from '../../../services/user.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'DeleteAccountModal',
  templateUrl: 'deleteAccountModal.html'
})
export class DeleteAccountModal {

  username: string;

  constructor(
    public viewCtrl: ViewController,
    private apiService: APIService,
    private params: NavParams,
    private settingsService: SettingsService,
    private userService: UserService,
    private routerService: RouterService,
    private apollo: Apollo
  ) { }

  delete() {
    this.apiService.deleteAccountById(this.userService.user.id).subscribe(
      result => {
        console.log(result);
        this.userService.signedIn = false;
        // reset apollo cache and refetch queries
        this.apollo.getClient().resetStore();
        localStorage.removeItem('pomb-user');
        this.viewCtrl.dismiss();
        this.routerService.navigateToPage('/');
        // reload window to update db role
        window.location.reload();
      }
    );
  }
}

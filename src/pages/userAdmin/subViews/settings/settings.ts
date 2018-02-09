import { Component, ViewChild } from '@angular/core';
import { ToastController, ModalController } from 'ionic-angular';

import { SettingsService } from '../../../../services/settings.service';
import { RouterService } from '../../../../services/router.service';
import { APIService } from '../../../../services/api.service';
import { UserService } from '../../../../services/user.service';
import { AlertService } from '../../../../services/alert.service';

import { DeleteAccountModal } from '../../../../components/modals/deleteAccountModal/deleteAccountModal';

@Component({
  selector: 'page-useradmin-settings',
  templateUrl: 'settings.html'
})
export class UserAdminSettingsPage {
  @ViewChild('changeForm') form;

  changeModel = { currentPassword: '', newPassword: '', confirmPassword: '' };

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private apiService: APIService,
    private userService: UserService,
    private toastCtrl: ToastController,
    private alertService: AlertService,
    private modalCtrl: ModalController
  ) {  }

  changePassword(model) {
    this.apiService.updatePassword(this.userService.user.id, model.currentPassword, model.newPassword).subscribe(
      result => {
        if (result.data.updatePassword.boolean) {
          const toast = this.toastCtrl.create({
            message: `Password changed`,
            duration: 3000,
            position: 'top'
          });

          toast.present();
          this.form.reset();
        } else {
          this.alertService.alert('Password Change Failed', 'Something went wrong. Make sure you have the correct current password');
        }
      }
    );
  }

  presentModal() {
    const modal = this.modalCtrl.create(DeleteAccountModal, { }, { cssClass: 'deleteAccountModal' });
    modal.present();
  }
}

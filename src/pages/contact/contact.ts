import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from 'ionic-angular';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { APIService } from '../../services/api.service';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  contactModel = { why: null, name: '', email: '', content: '' };

  whyOptions: { label: string; value: string; }[] = [
    { label: 'I need technical support / I found a bug', value: 'support' },
    { label: 'I need help figuring out how something works', value: 'question' },
    { label: 'I have some feedback about the application', value: 'feedback' },
    { label: 'Other', value: 'other' }
  ];

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private sanitizer: DomSanitizer,
    private apiService: APIService,
    private toastCtrl: ToastController
  ) {
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    this.settingsService.modPageMeta('Contact', 'Contact Pack On My Back with questions, concerns, or just a friendly hello.');
  }

  submitContact() {
    console.log(this.contactModel);
    this.apiService.sendContactEmail(this.contactModel).subscribe(
      result => {
        console.log(result);
        this.contactModel = { why: null, name: '', email: '', content: '' };

        const toast = this.toastCtrl.create({
          message: `Contact request sent`,
          duration: 3000,
          position: 'top'
        });

        toast.present();
      }
    );
  }
}

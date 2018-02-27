import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  contactModel = { why: null, name: '', email: '', content: '' };

  whyOptions: { label: string; value: string; }[] = [
    { label: 'I need technical support / I found a bug', value: 'support' },
    { label: 'I need help figuring out how something works', value: 'question' },
    { label: 'Other', value: 'other' }
  ];

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private sanitizer: DomSanitizer
  ) {
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    this.settingsService.modPageMeta('About', 'Pack On My Back is software platform intended to take the pain out of archiving your memories.');
  }
}

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'FadeCarousel',
  templateUrl: 'fadeCarousel.component.html'
})
export class FadeCarousel implements OnChanges {
  @Input() data = [];
  @Input() tripData: { totalLikes: number; likesArr: { id: number }[]; tripId: number; };
  @Input() title: string;
  @Input() btnLabel: string;
  @Input() flags: { url: string; name: string; }[] = [];
  @Input() stats: { icon: string; label: string; value: number }[] = [];
  @Input() trackUserId: number;
  @Output() btnClick = new EventEmitter<any>();

  displayedIndex = 0;

  constructor(
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
  ) {
    setInterval(() => {
      this.displayedIndex = this.displayedIndex === this.data.length - 1 ? 0 : this.displayedIndex + 1;
    }, 10000);
  }

  ngOnChanges() {
    if (!this.data.length) this.data = [{ imgURL: '../../assets/images/trip-default.jpg', tagline: '' }];
    console.log(this.data);
  }

  onBtnClick(): void {
    this.btnClick.emit();
  }
}

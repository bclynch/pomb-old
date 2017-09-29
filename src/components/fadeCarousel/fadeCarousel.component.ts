import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'FadeCarousel',
  templateUrl: 'fadeCarousel.component.html'
})
export class FadeCarousel {
  @Input() data: string[] = [];
  @Input() title: string;
  @Input() btnLabel: string;
  @Output() btnClick = new EventEmitter<any>();

  displayedIndex: number = 0;

  constructor(
    private settingsService: SettingsService
  ) { 
    setInterval(() => {
      this.displayedIndex = this.displayedIndex === this.data.length - 1 ? 0 : this.displayedIndex + 1; 
    }, 10000)
  }

  onBtnClick(): void {
    this.btnClick.emit();
  }
}

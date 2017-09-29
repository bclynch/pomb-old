import { Component, Input } from '@angular/core';

@Component({
  selector: 'FadeCarousel',
  templateUrl: 'fadeCarousel.component.html'
})
export class FadeCarousel {
  @Input() data: string[] = [];
  @Input() title: string;

  displayedIndex: number = 0;

  constructor() { 
    setInterval(() => {
      this.displayedIndex = this.displayedIndex === this.data.length - 1 ? 0 : this.displayedIndex + 1; 
    }, 10000)
  }

}

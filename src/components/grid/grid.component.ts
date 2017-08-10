import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'Grid',
  templateUrl: 'grid.component.html'
})
export class Grid {
  @Input() gridConfig: number[];
  @Input() posts = [];

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  width(i: number) {
    const calculatedWidth = this.sanitizer.bypassSecurityTrustStyle(`calc(${this.gridConfig[i] * 10}% - 1px * 2)`);
    // console.log(calculatedWidth);
    return calculatedWidth;
  }

}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ShareBtns',
  templateUrl: 'shareBtns.component.html'
})
export class ShareBtns {
  @Input() title: string;
  @Input() description: string;
  @Input() justIcons = false;
  @Input() size = -1;

  address = window.location.href;

  constructor() { }

}

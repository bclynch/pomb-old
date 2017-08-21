import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'DashboardCard',
  templateUrl: 'dashboardCard.component.html'
})
export class DashboardCard {
  @Input() data: Post;
  @Input() isActive: boolean;
  @Output() changeActive: EventEmitter<void> = new EventEmitter<void>();

  constructor(

  ) { 

  }

  selectActive() {
    this.changeActive.emit();
  }

}

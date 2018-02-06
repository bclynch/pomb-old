import { Component, Input } from '@angular/core';

import { SettingsService } from '../../services/settings.service';
import { APIService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'LikeCounter',
  templateUrl: 'likeCounter.component.html'
})
export class LikeCounter {
  @Input() totalLikes: number;
  @Input() userLikes: { id: number }[] = []; // whether user likes asset
  @Input() assetId: number;
  @Input() assetType: 'trip' | 'juncture' | 'post' | 'image';
  @Input() isVertical = true;
  @Input() hasLabel = false;
  @Input() color = '#bbb';

  constructor(
    private settingsService: SettingsService,
    private apiService: APIService,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  toggleLike() {
    if (this.userLikes.length) {
      // need to delete the existing like
      this.apiService.deleteLike(this.userLikes[0].id).subscribe(
        result => {
          this.userLikes = [];
          this.totalLikes--;
        }
      );
    } else {
      if (this.userService.user) {
        // need to add a like
        this.apiService.createLike(
          this.assetType === 'trip' ? this.assetId : null,
          this.assetType === 'juncture' ? this.assetId : null,
          this.assetType === 'post' ? this.assetId : null,
          this.assetType === 'image' ? this.assetId : null,
          this.userService.user.id
        ).subscribe(
          result => {
            this.totalLikes++;
            this.userLikes = [result.data.createLike.likeEdge.node];
          }
        );
      } else {
        this.alertService.alert('Log In', `You must be logged in to like this ${this.assetType}`);
      }
    }
  }
}

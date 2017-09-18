import { Component, Input } from '@angular/core';

import { SettingsService } from '../../../services/settings.service';
import { GalleryPhoto } from '../../../models/GalleryPhoto.model';

@Component({
  selector: 'GalleryCard',
  templateUrl: 'galleryCard.component.html'
})
export class GalleryCard {
  @Input() cardData: GalleryPhoto;

  constructor(
    private settingsService: SettingsService,
  ) { 

  }

}

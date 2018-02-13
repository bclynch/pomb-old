import { Component, Input } from '@angular/core';

import { SettingsService } from '../../services/settings.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'ProfilePicture',
  templateUrl: 'profilePicture.component.html'
})
export class ProfilePicture {
  @Input() photo: string;
  @Input() trackUserId: number;

  constructor(
    private settingsService: SettingsService,
    private userService: UserService
  ) { }

}

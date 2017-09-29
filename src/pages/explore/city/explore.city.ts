import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'page-explore-city',
  templateUrl: 'explore.city.html'
})
export class ExploreCityPage {

  constructor(
    private apiService: APIService,
    private router: Router,
    private settingsService: SettingsService,
  ) {  

  }

}

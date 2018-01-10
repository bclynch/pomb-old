import { Component, Input, SimpleChanges, SimpleChange, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime.js';

import { APIService } from '../../services/api.service';
import { RouterService } from '../../services/router.service';

interface Category {
  name: string;
  imgUrl: string;
}

@Component({
  selector: 'Search',
  templateUrl: 'search.html'
})
export class Search {
  @ViewChild('searchInput') searchInput;
  @Input() isActive: boolean;

  search = new FormControl();
  value = '';

  constructor(
    private apiService: APIService,
    private router: Router,
    private routerService: RouterService
  ) { }

  // focus on search input when it becomes visible
  ngOnChanges(changes: SimpleChanges) {
    const change: SimpleChange = changes.isActive;
    if (change.currentValue) this.searchInput.nativeElement.focus();
  }

  onClose() {
    // this.searchActive = false;
    // this.results = [];
  }

  submitQuery(e) {
    e.preventDefault();
    if (this.value) this.routerService.navigateToPage('/search', this.value);
  }
}

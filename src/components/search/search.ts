import { Component, Input, SimpleChanges, SimpleChange, ViewChild, OnChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime.js';

import { APIService } from '../../services/api.service';
import { RouterService } from '../../services/router.service';
import { SettingsService } from '../../services/settings.service';

interface Category {
  name: string;
  imgUrl: string;
}

@Component({
  selector: 'Search',
  templateUrl: 'search.html'
})
export class Search implements OnChanges {
  @ViewChild('searchInput') searchInput;
  @Input() isActive: boolean;
  @Input() canToggle = false;
  @Input() searchValue: string;
  @Input() hasBorder = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() searchSubmit: EventEmitter<void> = new EventEmitter<void>();

  search = new FormControl();
  value = '';
  isFocused = false;

  constructor(
    private apiService: APIService,
    private router: Router,
    private routerService: RouterService,
    private settingsService: SettingsService
  ) { }

  // focus on search input when it becomes visible
  ngOnChanges(changes: SimpleChanges) {
    const change: SimpleChange = changes.isActive;
    if (this.canToggle && change.currentValue) this.searchInput.nativeElement.focus();
    if (this.searchValue) this.value = this.searchValue;
  }

  closeSearch() {
    if (this.canToggle) {
      this.value = '';
      this.close.emit();
    }
  }

  emptySearch() {
    this.value = '';
  }

  submitQuery(e) {
    e.preventDefault();
    this.searchSubmit.emit();
    if (this.value) this.routerService.navigateToPage('/search', this.value);
  }
}

import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { APIService } from '../../services/api.service';

interface CountryResult { code: string; name: string; }

@Component({
  selector: 'CountrySearch',
  templateUrl: 'countrySearch.component.html'
})
export class CountrySearch {
  @Output() selectCountry: EventEmitter<CountryResult> = new EventEmitter<CountryResult>();

  search = new FormControl();
  value = '';
  searchResults: CountryResult[] = [];

  constructor(
    private apiService: APIService
  ) {
    this.search.valueChanges
      .debounceTime(250)
      .subscribe(query => {
        if (query) {
          console.log(query);
          this.apiService.searchCountries(query).valueChanges.subscribe(
            result => {
              console.log(result);
              // limiting to 5 results
              this.searchResults = result.data.searchCountries.nodes.slice(0, 5);
              console.log(this.searchResults);
            }
          );
        } else {
          this.searchResults = [];
        }
      });
  }

  submitQuery() {
    // debouncing a second so search results have a sec to catch up
    setTimeout(() => {
      if (this.searchResults.length && this.value.toLowerCase() === this.searchResults[0].name.toLowerCase()) {
        this.selectCountry.emit(this.searchResults[0]);
        this.value = '';
        this.searchResults = [];
      }
    }, 400);
  }

  onSelectCountry(country: CountryResult) {
    this.selectCountry.emit(country);
    this.value = '';
    this.searchResults = [];
  }
}

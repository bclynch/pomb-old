import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { APIService } from '../../services/api.service';

@Component({
  selector: 'TagSearch',
  templateUrl: 'tagSearch.component.html'
})
export class TagSearch {

  search = new FormControl();
  value: string = '';
  searchResults: { id: number, name: string }[] = [];

  constructor(
    private apiService: APIService
  ) { 
    this.search.valueChanges
      .debounceTime(400)
      .subscribe(query => { 
        if(query) {
          console.log(query);
          this.apiService.searchTags(query).subscribe(
            result => {
              this.searchResults = result.data.searchTags.nodes;
              console.log(this.searchResults);
            }
          )
        } else {
          this.searchResults = [];
        }
      });
  }

  submitQuery() {
    console.log(this.value);
    this.value = '';
  }

}

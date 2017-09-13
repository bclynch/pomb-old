import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { APIService } from '../../services/api.service';
import { Tag } from '../../models/Tag.model';

@Component({
  selector: 'TagSearch',
  templateUrl: 'tagSearch.component.html'
})
export class TagSearch {
  @Output() selectTag: EventEmitter<Tag> = new EventEmitter<Tag>();

  search = new FormControl();
  value: string = '';
  searchResults: Tag[] = [];

  constructor(
    private apiService: APIService
  ) { 
    this.search.valueChanges
      .debounceTime(250)
      .subscribe(query => { 
        if(query) {
          console.log(query);
          this.apiService.searchTags(query).subscribe(
            result => {
              //limiting to 5 results
              this.searchResults = result.data.searchTags.nodes.slice(0, 5);
              console.log(this.searchResults);
            }
          )
        } else {
          this.searchResults = [];
        }
      });
  }

  submitQuery() {
    //debouncing a second so search results have a sec to catch up
    setTimeout(() => {
      //if it equals the name of the search result we will use this to not add to db again because it already exists
      if(this.searchResults.length && this.value.toLowerCase() === this.searchResults[0].name) {
        this.selectTag.emit(this.searchResults[0]);
      } else {
        this.selectTag.emit({ id: null, name: this.value.toLowerCase() });
      }
      this.value = '';
      this.searchResults = [];
    }, 400);
  }

  onSelectTag(id: number, name: string) {
    this.selectTag.emit({id, name: name.toLowerCase()});
    this.value = '';
    this.searchResults = [];
  }
}

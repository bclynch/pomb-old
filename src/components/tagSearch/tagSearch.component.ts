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
      .debounceTime(400)
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
    //if it equals the name of the search result we will use this to not add to db again because it already exists
    if(this.searchResults.length && this.value.toLowerCase() === this.searchResults[0].name) {
      this.selectTag.emit(this.searchResults[0]);
    } else {
      //add to db
      this.apiService.createPostTag(this.value.toLowerCase()).subscribe(
        data => {
          const tagData = <any>data;
          tagData.data.createPostTag.postTag
          this.selectTag.emit({id: tagData.data.createPostTag.postTag.id, name: tagData.data.createPostTag.postTag.name});
        }
      )
    }
    this.value = '';
    this.searchResults = [];
  }

  onSelectTag(id: number, name: string) {
    this.selectTag.emit({id, name: name.toLowerCase()});
    this.value = '';
    this.searchResults = [];
  }
}

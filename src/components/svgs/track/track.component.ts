import { Component, Input } from '@angular/core';

@Component({
  selector: 'TrackIcon',
  templateUrl: 'track.component.html'
})
export class TrackIcon {
  @Input() color = 'white';

  constructor() { }

}

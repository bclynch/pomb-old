import { Component, Input } from '@angular/core';

@Component({
  selector: 'ProfileHeroBanner',
  templateUrl: 'profileHeroBanner.component.html'
})
export class ProfileHeroBanner {
  @Input() user;

  defaultBannerImg: string = 'https://www.yosemitehikes.com/images/wallpaper/yosemitehikes.com-bridalveil-winter-1200x800.jpg';

  constructor(

  ) { }

}

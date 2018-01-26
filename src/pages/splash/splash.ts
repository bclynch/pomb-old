import { Component } from '@angular/core';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})
export class SplashPage {

  benefits = [
    { icon: 'md-locate', description: 'Chart and monitor your journey with our gps plotting and visualization tools. Make your trip come alive with in depth statistics and beautiful visuals to show off to your friends and look back on in the future.' },
    { icon: 'md-create', description: 'Carve your own path and manage your memories with our blog management system software. Customize the look and feel of your entries and how you share your own story with the rest of the world.' },
    { icon: 'md-globe', description: 'Join our community of travel and outdoor enthusiasts to gain valuable insight and knowledge on potential outings and excursions around the globe. Learn what it takes to make your dreams come alive and inspire others along the way.' },
    { icon: 'md-compass', description: 'Take the stress out of keeping friends and family in the loop. Pack On My Back makes it easy to stay connected with its family of tools to track and share life\'s best moments.' },
  ];

  constructor(

  ) {  }

}

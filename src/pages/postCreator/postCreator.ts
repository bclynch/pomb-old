import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { APIService } from '../../services/api.service';

@Component({
  selector: 'page-postCreator',
  templateUrl: 'postCreator.html'
})
export class PostCreator implements OnInit {

  post;
  test: string = "<h1>It's alive!</h1><div>Cool beans</div>"
  derp: string = 'Sweet';

  constructor(
    private apiService: APIService,
    private router: Router
  ) {  }

  ngOnInit() {

  }

  getHTML() {
    this.test = this.derp;
    console.log(this.test);
  }
}

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

  postModel = {postTitle: '', postSubtitle: '', content: 'Sweet', leadPhoto: '', leadPhotoTitle: ''};

  constructor(
    private apiService: APIService,
    private router: Router
  ) {  }

  ngOnInit() {

  }

  getHTML() {
    this.test = this.postModel.content;
    console.log(this.test);
  }

  fileChange(e) {
    console.log(e);
    let fileList: FileList = e.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      //get signed request node server
      this.apiService.getSignedRequest(file).subscribe((result) => {
        console.log(result);
        this.apiService.uploadS3(file, result.signedRequest).then(() => {
          //successfully uploaded to s3
          //Need to save this url to post obj
          console.log(result.url);
          this.postModel.leadPhoto = result.url;
        });
      });
    }
  }
}

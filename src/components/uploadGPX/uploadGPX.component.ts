import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { APIService } from '../../services/api.service';

@Component({
  selector: 'uploadGPX',
  templateUrl: 'uploadGPX.component.html'
})
export class UploadGPX {
  @Input() junctureId: number;
  @Output() gpxUploaded: EventEmitter<any> = new EventEmitter<any>();

  isProcessing = false;
  filesToUpload: Array<File> = [];

  constructor(
    private apiService: APIService,
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer
  ) { }

  fileChangeEventGPX(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    const processedData = this.processFormData();

    this.apiService.uploadGPX(processedData, this.junctureId).subscribe(
        result => {
          console.log(result);
          this.gpxUploaded.emit(result.data.geoJSON);

          this.isProcessing = false;
        }
      );
  }

  private processFormData(): FormData {
    const formData: FormData = new FormData();
    const files: Array<File> = this.filesToUpload;

    for (let file of files) {
      formData.append('uploads[]', file, file.name);
    }

    this.isProcessing = true;
    return formData;
  }
}

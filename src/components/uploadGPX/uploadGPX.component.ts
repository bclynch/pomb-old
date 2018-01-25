import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { APIService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'uploadGPX',
  templateUrl: 'uploadGPX.component.html'
})
export class UploadGPX {
  @Input() junctureId: number;
  @Output() gpxProcessed: EventEmitter<any> = new EventEmitter<any>();

  isProcessing = false;
  filesToUpload: Array<File> = [];

  constructor(
    private apiService: APIService,
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
    private alertService: AlertService
  ) { }

  fileChangeEventGPX(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    const processedData = this.processFormData();

    this.apiService.processGPX(processedData).subscribe(
        result => {
          console.log(result);
          this.gpxProcessed.emit(result.data.geoJSON);

          this.isProcessing = false;
        }
      );
  }

  private processFormData(): FormData {
    const formData: FormData = new FormData();
    const files: Array<File> = this.filesToUpload;

    for (const file of files) {
      formData.append('uploads[]', file, file.name);
    }

    this.isProcessing = true;
    return formData;
  }

  presentInfo() {
    this.alertService.alert('GPX Upload', 'A GPX file is GPS data saved in the GPS Exchange format, an open standard that can be freely used by GPS programs. Import your own gpx files from apps or devices for a detailed trip juncture!');
  }
}

import { Component } from '@angular/core';

import { APIService } from '../../services/api.service';

@Component({
  selector: 'uploadGPX',
  templateUrl: 'uploadGPX.component.html'
})
export class UploadGPX {

  isProcessing = false;
  filesToUpload: Array<File> = [];

  constructor(
    private apiService: APIService
  ) { }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    const processedData = this.processFormData();

    this.apiService.uploadGPX(processedData).subscribe(
        result => {
          console.log(result);
          this.geoJsonObject = result.data.features[0];
          this.elevationTimeData = result.data.features[0].geometry.coordinates.map((coord, i) => { return { x: result.data.timeArr[i], y: coord[2] } });
          // reducing points on graph
          this.elevationTimeData = this.elevationTimeData.filter((_,i) => i % 15 == 0); 
          this.speedTimeData = result.data.features[0].speedsArr.map((speed, i) => { return { x: result.data.timeArr[i], y: speed } });
          // reducing points on graph
          this.speedTimeData = this.speedTimeData.filter((_,i) => i % 15 == 0); 
          this.elevationDistanceData = result.data.features[0].geometry.coordinates.map((coord, i) => { return { x: result.data.distanceArr[i] / 1000, y: coord[2] } });
          // reducing points on graph
          this.elevationDistanceData = this.elevationDistanceData.filter((_,i) => i % 15 == 0); 
          this.speedDistanceData = result.data.features[0].speedsArr.map((speed, i) => { return { x: result.data.distanceArr[i] / 1000, y: speed } });
          // reducing points on graph
          this.speedDistanceData = this.speedDistanceData.filter((_,i) => i % 15 == 0);
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

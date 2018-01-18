import { Component, Input, Output, EventEmitter,  ViewChild, ElementRef, OnChanges, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import Chart from 'chart.js';

@Component({
  selector: 'chart',
  templateUrl: 'chart.component.html'
})

export class ChartComponent implements OnChanges {
  @ViewChild('chart') chart: any;
  @Input() chartData: any;
  @Input() chartOptions: any;
  @Input() type: any;
  @Input() height = 'auto';
  // @Input() width = '100%';

  @Output() dataURL: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  renderCharts() {
    const chartCtx = this.chart.nativeElement.getContext('2d');

    const chart = new Chart(chartCtx, {
      type: this.type,
      data: this.chartData,
      options: this.chartOptions
    });

    // this.dataURL.emit( chart.legend.ctx.canvas.toDataURL('image/png') ); // handy for PDF output
  }

  ngOnChanges() {
    this.renderCharts();
  }
}

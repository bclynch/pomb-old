import { Component, Input, OnChanges } from '@angular/core';

import { SettingsService } from '../../services/settings.service';
import { BroadcastService } from '../../services/broadcast.service';
import { ExploreService } from '../../services/explore.service';
import { RouterService } from '../../services/router.service';
import { UtilService } from '../../services/util.service';

declare var google: any;

@Component({
  selector: 'GeoChart',
  template: `
    <div>
      <div id="geoChart" [style.width]="this.mapWidth"></div>
    </div>
    `
})
export class GoogleChartComponent implements OnChanges {
  @Input() mapWidth = '900px';
  @Input() backgroundColor = 'white';
  @Input() datalessColor = 'grey';
  @Input() defaultColor = 'white';
  @Input() region: string = null;
  @Input() countries: string[];

  private static googleLoaded: any;
  private options;
  private data;
  private chart;

  constructor(
    private settingsService: SettingsService,
    private broadcastService: BroadcastService,
    private exploreService: ExploreService,
    private routerService: RouterService,
    private utilService: UtilService
  ) {
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  // redraw map on data change
  ngOnChanges() {
    this.init();
  }

  getGoogle() {
      return google;
  }
  init() {
    if (!GoogleChartComponent.googleLoaded) {
      GoogleChartComponent.googleLoaded = true;
      google.charts.load('current',  {packages: ['geochart'], mapsApiKey: 'AIzaSyAa8icfucqEezbxr0iAHg5sXaY2HbyOS2E'});
    }
    google.charts.setOnLoadCallback(() => this.drawGraph());
  }

  drawGraph() {
    const self = this;
    // https://developers.google.com/chart/interactive/docs/gallery/geochart#continent-hierarchy-and-codes
    this.data = google.visualization.arrayToDataTable(this.countries);

      this.options = {
        region: this.region,
        datalessRegionColor: this.datalessColor,
        defaultColor: this.defaultColor,
        displayMode: 'regions',
        keepAspectRatio: true,
        backgroundColor: this.backgroundColor
      };

    this.chart = this.createBarChart(document.getElementById('geoChart'));

    google.visualization.events.addListener(this.chart, 'regionClick', myPageEventHandler);
    function myPageEventHandler(e) {
      // console.log(e);
      // // if its not a region code we know its a country code
      // if (Object.keys(self.exploreService.googleRegionCodes).indexOf(e.region) === -1) {
      //   self.routerService.navigateToPage(`/explore/country/${self.utilService.formatForURLString(self.exploreService.countryCodeObj[e.region].name)}`);
      // } else {
      //   self.routerService.navigateToPage(`/explore/region/${self.utilService.formatForURLString(self.exploreService.googleRegionCodes[e.region])}`);
      // }
    }
    this.chart.draw(this.data, this.options);
  }

  createBarChart(element: any): any {
    return new google.visualization.GeoChart(element);
  }
}

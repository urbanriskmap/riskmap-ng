import { Component, Input, OnInit } from '@angular/core';

import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-basin-info',
  templateUrl: './basin-info.component.html',
  styleUrls: ['./basin-info.component.scss']
})
export class BasinInfoComponent implements OnInit {
  @Input() sites: {
    [name: string]: any
  }[];
  @Input() basin;

  siteList: {
    name: string,
    stations: {
      name: string,
      selected: boolean
    }[]
  }[];

  constructor(
    public httpService: HttpService
  ) { }

  ngOnInit() {
    this.siteList = [];
    for (const site of this.sites) {
      let stationList = [];
      for (const station of site.stations) {
        stationList.push({
          name: station,
          selected: false
        });
      }

      this.siteList.push({
        name: site.name,
        stations: stationList
      });
    }
  }

  submitSelection() {
    console.log(this.siteList);
    // Filter list as a flat array with stationId's

    // Iterate
      // Call http service to get mean data
        // Call chart service to draw charts

    // Can use app-sensor-info as child-components in same window
    // Toggle window state between 'selector' card and 'charts' panel
  }
}

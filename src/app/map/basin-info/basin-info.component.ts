import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import layers from '../../../resources/layers';
import { ChartService } from '../../services/chart.service';
import { HttpService } from '../../services/http.service';
import { SensorInterface } from '../../interfaces';

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

  filteredStationList: {
    id: string,
    class: string,
    stationId: string,
    selected: boolean,
    units: string,
    observations?: {
      value: number,
      datetime: string
    }[]
  }[];

  features: SensorInterface[] = [];

  constructor(
    private chartService: ChartService,
    public httpService: HttpService
  ) { }

  ngOnInit() {
    for (let site of this.sites) {
      for (let station of site.stations) {
        station.selected = false;
      }
    }
  }

  submitSelection(): void {
    this.filteredStationList = [];

    // Filter list as a flat array with stationId's
    for (const site of this.sites) {
      for (const station of site.stations) {
        if (station.selected) this.filteredStationList.push(station);
      }
    }

    let server;
    for (const layer of layers.supported) {
      if (layer.metadata.name === 'sensors_sfwmd') {
        server = layer.metadata.server;
      };
    }
    const flags = [{type: 'aggregate'}];

    for (const station of this.filteredStationList) {
      this.httpService
      .getJsonData(server, station.id, flags)
      .then((sensors) => {
        this.features.push([{
          layer: {id: 'sensors_sfwmd'},
          properties: {
            class: station.class,
            name: station.stationId,
            observations: sensors[0].properties.observations,
            units: station.units
          },
          supressChartTitles: true
        }]);
      })
      .catch((error) => console.log(error));
    }

    // TODO: Toggle window state between 'selector' card and 'charts' panel
  }
}

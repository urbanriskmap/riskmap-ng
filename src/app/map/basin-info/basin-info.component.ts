import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
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
export class BasinInfoComponent implements OnInit, OnDestroy {
  @Input() sites: {
    [name: string]: any
  }[];
  @Input() basin;

  areStationsSelected = false;
  features: SensorInterface[] = [];

  sfwmdIconMap = {
    H: 'headwater',
    T: 'tailwater',
    S: 'spillway',
    W: 'weir',
    C: 'discharge',
    P: 'pump'
  };

  @Output() closePanel = new EventEmitter<null>();

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

  checkSelectionList() {
    for (const site of this.sites) {
      for (const station of site.stations) {
        if (station.selected) {
          this.areStationsSelected = true;
          return;
        }
      }
    }

    this.areStationsSelected = false;
  }

  submitSelection(): void {
    let filteredStationList = [];

    // Filter list as a flat array with stationId's
    for (const site of this.sites) {
      for (const station of site.stations) {
        if (station.selected) filteredStationList.push(station);
      }
    }

    let server;
    for (const layer of layers.supported) {
      if (layer.metadata.name === 'sensors_sfwmd') {
        server = layer.metadata.server;
      };
    }
    const flags = [{type: 'aggregate'}];

    for (const station of filteredStationList) {
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
  }

  resetSelection() {
    this.features = [];
  }

  ngOnDestroy() {
    this.features = [];
    for (const site of this.sites) {
      for (const station of site.stations) {
        station.selected = false;
      }
    }
  }
}

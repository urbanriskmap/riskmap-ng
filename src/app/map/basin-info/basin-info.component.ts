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
    public chartService: ChartService,
    public httpService: HttpService
  ) { }

  ngOnInit() {
    for (const site of this.sites) {
      for (const station of site.stations) {
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
    const filteredStationList = [];

    // Filter list as a flat array with stationId's
    for (const site of this.sites) {
      for (const station of site.stations) {
        if (station.selected) {
          filteredStationList.push(station);
        }
      }
    }

    let server;
    for (const layer of layers.supported) {
      if (layer.metadata.name === 'sensors_sfwmd') {
        server = layer.metadata.server;
      }
    }
    const flags = [{type: 'aggregate'}];

    for (const station of filteredStationList) {
      this.httpService
      .getJsonData(server, station.id, flags)
      .then((sensors) => {
        let observations;
        if (Array.isArray(sensors)
        && sensors[0]
        && sensors[0].properties
        && sensors[0].properties.observations) {
          observations = sensors[0].properties.observations;
        }

        this.features.push([{
          layer: {id: 'sensors_sfwmd'},
          properties: {
            class: station.class,
            name: station.stationId,
            observations: observations,
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

  exportSensorData(name, observations) {
    let dataStr = 'data:application/csv;charset=utf-8,';
    const fields = Object.keys(observations[0]);
    const replacer = (key, value) => value === null ? '' : value;

    const csv = observations.map((row) => fields.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(fields.join(','));

    dataStr += encodeURIComponent(csv.join('\r\n'));

    const anchorNode = document.createElement('a');
    anchorNode.setAttribute('href', dataStr);
    anchorNode.setAttribute('download', 'station_' + name + '.csv');
    anchorNode.click();
    anchorNode.remove();
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

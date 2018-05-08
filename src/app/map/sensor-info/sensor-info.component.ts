import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { ChartService } from '../../services/chart.service';
import { SensorInterface } from '../../interfaces';

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrls: ['./sensor-info.component.scss']
})
export class SensorInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() features: {
    [name: string]: any
  }[];

  feature: SensorInterface;
  hasUpstreamDownstream: boolean | null;
  //TODO aditya - add locale keys
  usgsSensorMap = {
    '_63160': {
      title: 'Stream water elevation',
      datum: 'NAVD 1988'
    },
    '_00065': {
      title: 'Gauge height',
      datum: 'NAVD 1988'
    },
    '_62610': {
      title: 'Groundwater level',
      datum: 'NGVD 1929'
    },
    '_00060': {
      title: 'Discharge'
    },
    '_00045': {
      title: 'Precipitation total'
    }
  };

  constructor(
    private chartService: ChartService
  ) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('features')) {
      this.feature = this.features[0].properties;

      switch (this.features[0].layer.id) {
        case 'sensors':
          this.chartService.parseData(
            this.feature.id,
            this.usgsSensorMap['_' + this.feature.class],
            this.feature.units
          ).then(hasUpstreamDownstream => {
            this.hasUpstreamDownstream = hasUpstreamDownstream;

            this.chartService.drawSensorChart(document.getElementById('sensorChartWrapper'));
          })
          .catch(error => console.log(error));
          break;

        case 'floodgauges':
          this.chartService.sensorData = {dataset_1: []};

          for (const obs of JSON.parse(this.feature.observations)) {
            this.chartService.sensorData.dataset_1.push({
              y: obs.f2,
              t: obs.f1
            });
          }

          this.chartService.drawSensorChart(document.getElementById('sensorChartWrapper'));
          break;

        default:
          // do something
      }
    }
  }

  ngOnDestroy(): void {
    this.features = null;
    this.feature = null;
  }
}

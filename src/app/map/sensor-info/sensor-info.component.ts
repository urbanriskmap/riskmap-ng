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
  usgsSensorMap = {
    '_63160': {
      title: '63160',
      datum: 'NAVD 1988'
    },
    '_00065': {
      title: '00065',
      datum: 'NAVD 1988'
    },
    '_62610': {
      title: '62610',
      datum: 'NGVD 1929'
    },
    '_00060': {
      title: '00060'
    },
    '_00045': {
      title: '00045'
    }
  };

  constructor(
    public chartService: ChartService
  ) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('features')) {
      this.feature = this.features[0].properties;

      switch (this.features[0].layer.id) {
        case 'sensors_usgs':
          const observations = JSON.parse(this.feature.observations);
          const properties = {
            title: this.feature.class,
            units: this.feature.units,
            datum: this.usgsSensorMap['_' + this.feature.class].datum
          };

          if (Array.isArray(observations)) {
            this.chartService.drawSensorChart(
              document.getElementById('sensorChartWrapper'),
              this.chartService.parseData(observations, false),
              properties
            );
          } else if (
            observations.hasOwnProperty('upstream')
            && observations.hasOwnProperty('downstream')
          ) {
            this.hasUpstreamDownstream = true;

            this.chartService.drawSensorChart(
              document.getElementById('sensorChartWrapper'),
              this.chartService.parseData(observations, true),
              properties
            );
          }
          break;

        case 'floodgauges':
          const sensorData = {dataset_1: []};

          for (const obs of JSON.parse(this.feature.observations)) {
            sensorData.dataset_1.push({
              y: obs.f2,
              t: obs.f1
            });
          }

          this.chartService.drawSensorChart(
            document.getElementById('sensorChartWrapper'),
            sensorData,
            {
              title: 'Set Title',
              units: 'Set Units',
              datum: 'If available'
            }
          );
          break;

        default:
          // do something
      }
    }
  }

  ngOnDestroy(): void {
    this.features = null;
    this.feature = null;
    this.hasUpstreamDownstream = null;
  }
}

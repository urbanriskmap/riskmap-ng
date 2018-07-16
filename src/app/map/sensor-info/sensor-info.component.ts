import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { ChartService } from '../../services/chart.service';
import { SensorInterface } from '../../interfaces';

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrls: ['./sensor-info.component.scss']
})
export class SensorInfoComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() features: {
    [name: string]: any
  }[];
  properties: {
    title: string,
    units: string,
    datum?: string
  };
  sensorData: {
    dataset_1: {y: number, t: string}[],
    dataset_2?: {y: number, t: string}[]
  };

  idIndex = '_' + Math.floor(Math.random() * 100);
  // idIndex = '';

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
  sfwmdSensorMap = { // TODO Move to locales
    H: 'Headwater elevation',
    T: 'Tailwater elevation',
    S: 'Spillway',
    P: 'Pump',
    C: 'Culvert',
    W: 'Weir'
  };

  constructor(
    private chartService: ChartService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.hasOwnProperty('features')) {
      let observations;
      this.feature = this.features[0].properties;

      switch (this.features[0].layer.id) {
        case 'sensors_usgs':
          observations = JSON.parse(this.feature.observations);
          this.properties = {
            title: this.feature.class,
            units: this.feature.units,
            datum: this.usgsSensorMap['_' + this.feature.class].datum
          };

          if (Array.isArray(observations)) {
            this.sensorData = this.chartService.parseData(observations, false);
          } else if (
            observations.hasOwnProperty('upstream')
            && observations.hasOwnProperty('downstream')
          ) {
            this.hasUpstreamDownstream = true;
            this.sensorData = this.chartService.parseData(observations, true);
          }
          break;

        case 'sensors_sfwmd':
          observations = Array.isArray(this.feature.observations) ?
            this.feature.observations :
            JSON.parse(this.feature.observations);
          this.properties = {
            title: 'Get from Site Map',
            units: this.sfwmdSensorMap[this.feature.class] + ', ' + this.feature.units,
            datum: ' '
          };

          this.sensorData = this.chartService.parseData(observations, false);
          break;

        case 'floodgauges':
          const sensorData = {dataset_1: []};

          for (const obs of JSON.parse(this.feature.observations)) {
            sensorData.dataset_1.push({
              y: obs.f2,
              t: obs.f1
            });
          }

          this.sensorData = sensorData;
          this.properties = {
            title: 'Set Title',
            units: 'Set Units',
            datum: 'If available'
          };
          break;

        default:
          // do something
      }
    }
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.chartService.drawSensorChart(
      {
        element: document.getElementById('sensorChartWrapper' + this.idIndex),
        id: this.idIndex
      },
      this.sensorData,
      this.properties
    );
  }

  ngOnDestroy(): void {
    this.features = null;
    this.feature = null;
    this.properties = null;
    this.sensorData = null;
    this.idIndex = null;
    this.hasUpstreamDownstream = null;
  }
}

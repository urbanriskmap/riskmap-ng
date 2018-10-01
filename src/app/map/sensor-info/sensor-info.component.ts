import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
  @Input() showPoints: boolean;

  properties: {
    title: string,
    units: string,
    datum?: string
  };
  sensorData: {
    metadata: {[name: string]: any},
    dataset_1: {y: number, t: string}[],
    dataset_2?: {y: number, t: string}[]
  };

  idIndex = '_' + Math.floor(Math.random() * 100);
  isComponentOpen: boolean;

  feature: SensorInterface;
  hasSubDataStreams: string[] = [];
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
    public chartService: ChartService,
    public translate: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('features')) {
      let observations;
      this.feature = this.features[0].properties;

      if (this.feature.observations) {
        switch (this.features[0].layer.id) {
          case 'sensors_usgs':
            observations = JSON.parse(this.feature.observations);
            this.properties = {
              title: 'usgs.' + this.feature.class,
              units: this.feature.units,
              datum: this.usgsSensorMap['_' + this.feature.class].datum
            };

            if (Array.isArray(observations)) {
              this.sensorData = this.chartService.parseData(observations, this.hasSubDataStreams);
            } else if (
              observations.hasOwnProperty('upstream')
              && observations.hasOwnProperty('downstream')
            ) {
              this.hasSubDataStreams = ['upstream', 'downstream'];
              this.sensorData = this.chartService.parseData(observations, this.hasSubDataStreams);
            }
            break;

          case 'sensors_sfwmd':
            observations = Array.isArray(this.feature.observations) ?
              this.feature.observations :
              JSON.parse(this.feature.observations);

            if (this.features[0].hasOwnProperty('supressChartTitles')) {
              this.properties = {
                title: '',
                units: this.feature.units,
                datum: ''
              };
            } else {
              this.properties = {
                title: 'sfwmd.' + this.feature.class,
                units: this.feature.stationId + ', ' + this.feature.units,
                datum: ' '
              };
            }

            this.sensorData = this.chartService.parseData(observations, this.hasSubDataStreams);

            if (this.feature.hasOwnProperty('controlElevation')) {
              this.sensorData.metadata.controlElevation = this.feature.controlElevation;
            }
            if (this.feature.hasOwnProperty('warningElevation')) {
              this.sensorData.metadata.warningElevation = this.feature.warningElevation;
            }


            break;

          case 'sensors_noaa':
            observations = JSON.parse(this.feature.observations);
            this.properties = {
              title: this.feature.name,
              units: this.feature.units,
              datum: this.feature.datum
            };

            if (Array.isArray(observations)) {
              this.sensorData = this.chartService.parseData(observations, this.hasSubDataStreams);
            } else if (
              observations.hasOwnProperty('water_level')
              && observations.hasOwnProperty('predictions')
            ) {
              this.hasSubDataStreams = ['water_level', 'predictions'];
              this.sensorData = this.chartService.parseData(observations, this.hasSubDataStreams);
            }
            break;

          case 'floodgauges':
            const sensorData = {
              metadata: {},
              dataset_1: []
            };

            for (const obs of JSON.parse(this.feature.observations)) {
              sensorData.dataset_1.push({
                y: obs.f2,
                t: obs.f1
              });
            }

            if (sensorData.dataset_1.length) {
              sensorData.metadata['lastUpdated'] = sensorData.dataset_1[sensorData.dataset_1.length - 1].t;
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

        if (this.isComponentOpen) {
          this.drawChart();
        }
      }
    }
  }

  drawChart() {
    this.chartService.drawSensorChart(
      {
        element: document.getElementById('sensorChartWrapper' + this.idIndex),
        id: this.idIndex
      },
      this.sensorData,
      this.properties,
      this.showPoints
    );
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    if (this.sensorData) {
      this.drawChart();
      this.isComponentOpen = true;
    }
  }

  ngOnDestroy(): void {
    this.features = null;
    this.feature = null;
    this.properties = null;
    this.sensorData = null;
    this.idIndex = null;
    this.hasSubDataStreams = [];
  }
}

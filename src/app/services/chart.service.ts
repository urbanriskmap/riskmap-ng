import { Injectable } from '@angular/core';
import * as Chart from 'chart.js';
import { TranslateService } from '@ngx-translate/core';

import { HttpService } from './http.service';
import { TimeService } from './time.service';

@Injectable()
export class ChartService {
  sensorChart: Chart;

  constructor(
    private httpService: HttpService,
    private timeService: TimeService,
    public translate: TranslateService
  ) { }

  parseData(
    observations: any,
    hasUpstreamDownstream: boolean
  ): {
    dataset_1: {y: number, t: string}[],
    dataset_2?: {y: number, t: string}[]
  } {
    let sensorData;

    if (hasUpstreamDownstream) {
      sensorData = {
        dataset_1: [],
        dataset_2: []
      };

      for (const i in observations['upstream']) {
        if (i) {
          sensorData.dataset_1.push({
            y: parseFloat(observations['upstream'][i].value),
            t: observations['upstream'][i].dateTime.substring(0, 19)
          });
          sensorData.dataset_2.push({
            y: parseFloat(observations['downstream'][i].value),
            t: observations['downstream'][i].dateTime.substring(0, 19)
          });
        }
      }
    } else {
      sensorData = {
        dataset_1: []
      };

      for (const obs of observations) {
        sensorData.dataset_1.push({
          y: parseFloat(obs['value']),
          t: obs['dateTime'].substring(0, 19)
        });
      }
    }

    return sensorData;
  }

  prepareCanvas(html: {
    element: any,
    id: string
  }) {
    // Empty wrapper
    while (html.element.firstChild) {
      html.element.removeChild(
        html.element.firstChild
      );
    }

    // Append canvas
    const canvasElement = document.createElement('canvas');
    canvasElement.setAttribute('id', 'chartInset' + html.id);
    document.getElementById('sensorChartWrapper' + html.id).appendChild(canvasElement);

    const canvas = document.getElementById('chartInset' + html.id);
    const chart_ctx = canvas['getContext']('2d');

    return chart_ctx;
  }

  prepareSensorChart(
    sensorData: {
      dataset_1: {y: number, t: string}[],
      dataset_2?: {y: number, t: string}[]
    },
    sensorProperties: {
      title: string,
      units: string,
      datum?: string
    }
  ) {
    const datasets = [];

    const labels = {up: null, down: null};
    this.translate.get('sensorLabels.up').subscribe((res: string) => {
      labels.up = res;
    });
    this.translate.get('sensorLabels.down').subscribe((res: string) => {
      labels.down = res;
    });

    if (sensorData.hasOwnProperty('dataset_2')) {
      datasets.push(
        {
          label: labels.up,
          xAxisId: 'x1',
          yAxisId: 'y1',
          borderWidth: 1,
          borderColor: '#1ac892',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          pointRadius: 0,
          lineTension: 0,
          data: sensorData.dataset_1,
        },
        {
          label: labels.down,
          xAxisId: 'x1',
          yAxisId: 'y1',
          borderWidth: 1,
          borderColor: '#0891fb',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          pointRadius: 0,
          lineTension: 0,
          data: sensorData.dataset_2,
        }
      );
    } else {
      datasets.push(
        {
          label: '',
          xAxisId: 'x1',
          yAxisId: 'y1',
          borderWidth: 1,
          borderColor: '#00579b', // dark-azure
          backgroundColor: 'rgba(0, 0, 0, 0)',
          pointRadius: 0,
          lineTension: 0,
          data: sensorData.dataset_1,
        }
      );
    }

    let title;
    if (sensorProperties.title) {
      this.translate.get('sensorTitle.' + sensorProperties.title).subscribe((res: string) => {
        title = [res];

        if (sensorProperties.hasOwnProperty('datum')
          && sensorProperties.datum) {
          // CASE: USGS sensors
          title.push(
            sensorProperties.units + ' ' + sensorProperties.datum
          );
        } else {
          // CASE: Default, most sensors
          title[0] += ' (' + sensorProperties.units + ')';
        }
      });
    } else {
      // CASE: multi-station stacked charts
      title = sensorProperties.units;
    }

    return {
      type: 'line',
      data: {
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          fontColor: '#2f2f2f',
          text: title,
          fontSize: 10,
          padding: 3
        },
        legend: {
          display: sensorData.hasOwnProperty('dataset_2'),
          position: 'bottom',
          labels: {
            fontColor: '#2f2f2f',
            fontFamily: '"Roboto-Medium", "Roboto", "Open Sans"',
            fontSize: 10,
            padding: 3
          }
        },
        scales: {
          yAxes: [{
            id: 'y1',
            type: 'linear',
            position: 'left',
            ticks: {
              fontColor: '#2f2f2f',
              fontSize: 10
            }
          }],
          xAxes: [{
            id: 'x1',
            type: 'time',
            time: {
              unit: 'hour',
              unitStepSize: 1,
              displayFormats: {
                hour: 'HH:mm'
              },
              // COMBAK: glitch in 'id' deployment ?
              parser: (time) => {
                return this.timeService.getLocalTime(time);
              }
            },
            position: 'bottom',
            ticks: {
              autoSkip: true,
              autoSkipPadding: 12,
              fontColor: '#2f2f2f',
              fontSize: 10
            }
          }],
        }
      }
    };
  }

  drawSensorChart(
    html: {
      element: any,
      id: string
    },
    sensorData: {
      dataset_1: {y: number, t: string}[],
      dataset_2?: {y: number, t: string}[]
    },
    sensorProperties: {
      title: string,
      units: string,
      datum?: string
    }
  ) {
    this.sensorChart = new Chart(
      this.prepareCanvas(html),
      this.prepareSensorChart(sensorData, sensorProperties)
    );
  }
}

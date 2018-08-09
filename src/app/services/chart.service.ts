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
    metadata: {[name: string]: any}
    dataset_1: {y: number, t: string}[],
    dataset_2?: {y: number, t: string}[]
  } {
    let sensorData;

    if (hasUpstreamDownstream) {
      sensorData = {
        metadata: {},
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
        metadata: {},
        dataset_1: []
      };

      for (const obs of observations) {
        sensorData.dataset_1.push({
          y: parseFloat(obs['value']),
          t: obs['dateTime'].substring(0, 19)
        });
      }
    }

    if (sensorData.dataset_1.length) {
      sensorData.metadata['lastUpdated'] = sensorData.dataset_1[sensorData.dataset_1.length - 1].t;
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
      metadata: {
        [name: string]: any
      },
      dataset_1: {y: number, t: string}[],
      dataset_2?: {y: number, t: string}[]
    },
    sensorProperties: {
      title: string,
      units: string,
      datum?: string
    },
    showPoints: boolean
  ) {
    const datasets = [];

    const labels = {up: null, down: null};
    this.translate.get('sensorLabels.up').subscribe((res: string) => {
      labels.up = res;
    });
    this.translate.get('sensorLabels.down').subscribe((res: string) => {
      labels.down = res;
    });

    // Check for SFWMD elevation stations controlElevation value
    if (sensorData.metadata.hasOwnProperty('controlElevation')
      && sensorData.metadata.controlElevation
      && sensorData.dataset_1.length) {
      let controlElevation;
      const firstDatetime = sensorData.dataset_1[0].t;
      const lastDatetime = sensorData.dataset_1[sensorData.dataset_1.length - 1].t;

      if (Array.isArray(sensorData.metadata.controlElevation)) {
        controlElevation = sensorData.metadata.controlElevation[0];
      } else {
        controlElevation = sensorData.metadata.controlElevation;
      }

      // Style control elevation reference line + fill
      datasets.push(
        {
          label: 'Control elevation',
          xAxisId: 'x1',
          yAxisId: 'y1',
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: 'origin',
          borderColor: 'rgba(8, 145, 251, 0.5)',
          backgroundColor: 'rgba(8, 145, 251, 0.15)', // from palette: (mat-azure, 500)
          data: [
            {y: controlElevation, t: firstDatetime},
            {y: controlElevation, t: lastDatetime}
          ]
        }
      );
    }

    const styleDataset = (
      label: string,
      stroke: number,
      lineColor: string,
      bgColor: string,
      points: boolean,
      data: {[name: string]: any}[]
    ) => {
      return {
        label: label,
        xAxisId: 'x1',
        yAxisId: 'y1',
        borderWidth: stroke,
        borderColor: lineColor,
        backgroundColor: bgColor ? bgColor : 'rgba(0, 0, 0, 0)',
        pointRadius: points ? 3 : 0,
        lineTension: 0,
        data: data
      };
    };

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
      // title = ['Units: ' + sensorProperties.units];
      title = [sensorProperties.units];

      if (sensorData.metadata.hasOwnProperty('lastUpdated')) {
        let timeUnit, num;
        const updated = Date.parse(sensorData.metadata.lastUpdated);
        const difference = Date.now() - updated;

        switch(true) {
          case (difference < 59999):
            timeUnit = 'less than a minute ago';
            break;
          case (difference >= 60000 && difference < 3599999):
            num = Math.round(difference / 60000);
            timeUnit = num + (num === 1 ? ' minute ago' : ' minutes ago');
            break;
          case (difference >= 3600000 && difference < 86400000):
            const localTime = this.timeService.getLocalTime(sensorData.metadata.lastUpdated);
            timeUnit = ' at ' + localTime.hour() + ':' + localTime.minute();
            break;
          case (difference >= 86400000):
            timeUnit = ' more than 24 hrs ago';
          default:
            timeUnit = 'N/A';
        }

        title.push(' Updated ' + timeUnit);
      }
    }

    if (sensorData.hasOwnProperty('dataset_2')) {
      // Upstream, Downstream values (USGS)
      datasets.push(
        styleDataset(labels.up, 1, '#1ac892', null, false, sensorData.dataset_1),
        styleDataset(labels.down, 1, '#0891fb', null, false, sensorData.dataset_2)
      );
    } else {
      // Default
      datasets.push(
        styleDataset(title, 1, '#00579b', null, showPoints, sensorData.dataset_1)
      );
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
          display: false,
          // fontColor: '#2f2f2f',
          // text: title,
          // fontSize: 10,
          // padding: 3
        },
        legend: {
          display: true, // sensorData.hasOwnProperty('dataset_2'),
          position: 'top',
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
      metadata: {[name: string]: any},
      dataset_1: {y: number, t: string}[],
      dataset_2?: {y: number, t: string}[]
    },
    sensorProperties: {
      title: string,
      units: string,
      datum?: string
    },
    showPoints?: boolean
  ) {
    this.sensorChart = new Chart(
      this.prepareCanvas(html),
      this.prepareSensorChart(sensorData, sensorProperties, showPoints)
    );
  }
}

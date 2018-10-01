import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';
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
    hasSubDataStreams: string[]
  ): {
    metadata: {[name: string]: any}
    dataset_1: {y: number, t: string}[],
    dataset_2?: {y: number, t: string}[]
  } {
    let sensorData;

    if (hasSubDataStreams.length) {
      sensorData = {
        metadata: {subDataStreamLabels: hasSubDataStreams},
        dataset_1: [],
        dataset_2: []
      };

      for (const i in observations[hasSubDataStreams[0]]) {
        if (i) {
          sensorData.dataset_1.push({
            y: parseFloat(observations[hasSubDataStreams[0]][i].value),
            t: observations[hasSubDataStreams[0]][i].dateTime.substring(0, 19)
          });
        }
      }

      for (const i in observations[hasSubDataStreams[1]]) {
        if (i) {
          sensorData.dataset_2.push({
            y: parseFloat(observations[hasSubDataStreams[1]][i].value),
            t: observations[hasSubDataStreams[1]][i].dateTime.substring(0, 19)
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

  // TODO: break into smaller functions
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

    // TODO: move to separate method
    let labels: {dataSet_1: string | null, dataSet_2: string | null};
    if (sensorData.metadata.hasOwnProperty('subDataStreamLabels')) {
      switch (sensorData.metadata.subDataStreamLabels[0]) {
        case 'upstream':
          this.translate.get('sensorLabels.up').subscribe((res: string) => {
            labels.dataSet_1 = res;
          });
          this.translate.get('sensorLabels.down').subscribe((res: string) => {
            labels.dataSet_2 = res;
          });
          break;

        case 'water_level':
          labels = {dataSet_1: 'Recorded', dataSet_2: 'Predicted'};
          break;

        default:
          labels = {dataSet_1: null, dataSet_2: null};
      }
    }

    // Check for SFWMD elevation stations controlElevation value
    if (sensorData.metadata.hasOwnProperty('controlElevation')
      && sensorData.metadata.controlElevation
      && sensorData.dataset_1.length) {
      const controlElevation = sensorData.metadata.controlElevation;
      const warningElevation = sensorData.metadata.warningElevation;
      const firstDatetime = sensorData.dataset_1[0].t;
      const lastDatetime = sensorData.dataset_1[sensorData.dataset_1.length - 1].t;

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
        },
        {
          label: 'Alert level',
          xAxisId: 'x1',
          yAxisId: 'y1',
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 0,
          borderColor: '#c23700',
          data: [
            {y: warningElevation, t: firstDatetime},
            {y: warningElevation, t: lastDatetime}
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

        switch (true) {
          case (difference < 59999):
            timeUnit = 'less than a minute ago';
            break;
          case (difference >= 60000 && difference < 3599999):
            num = Math.round(difference / 60000);
            timeUnit = num + (num === 1 ? ' minute ago' : ' minutes ago');
            break;
          case (difference >= 3600000 && difference < 86400000):
            const localTime = this.timeService.getLocalTime(sensorData.metadata.lastUpdated);
            timeUnit = 'at ' + localTime.hour() + ':' + localTime.minute();
            break;
          case (difference >= 86400000):
            timeUnit = 'more than 24 hrs ago';
            break;
          default:
            timeUnit = 'N/A';
        }

        title.push(' Updated ' + timeUnit);
      }
    }

    if (sensorData.hasOwnProperty('dataset_2')) {
      // Upstream, Downstream values (USGS)
      // Recorded, Predicted values (NOAA)
      datasets.push(
        styleDataset(labels.dataSet_1, 1, '#00579b', null, false, sensorData.dataset_1),
        styleDataset(labels.dataSet_2, 1, 'rgba(8, 145, 251, 0.5)', null, false, sensorData.dataset_2)
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

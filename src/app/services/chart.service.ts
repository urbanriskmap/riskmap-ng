import { Injectable } from '@angular/core';

import { HttpService } from './http.service';

@Injectable()
export class ChartService {
  sensorData: {
    dataset_1: {t: number, y: string}[],
    dataset_2?: {t: number, y: string}[]
  };

  constructor(
    private httpService: HttpService
  ) { }

  parseData(sensor_id: number): boolean | null {
    let hasUpstreamDownstream;

    this.httpService.getJsonData('sensors', 'sensors/' + sensor_id)
    .then(data => {

      if (Array.isArray(data[0].properties.observations)) {
        hasUpstreamDownstream = false;
        this.sensorData = {
          dataset_1: []
        };

        for (const obs of data[0].properties.observations) {
          this.sensorData.dataset_1.push({
            t: parseFloat(obs.value),
            y: obs.dateTime
          });
        }

      } else {
        hasUpstreamDownstream = true;
        const observations = data[0].properties.observations;
        this.sensorData = {
          dataset_1: [],
          dataset_2: []
        };

        for (const i in observations.upstream) {
          if (i) {
            this.sensorData.dataset_1.push({
              t: parseFloat(observations.upstream[i].value),
              y: observations.upstream[i].dateTime
            });
            this.sensorData.dataset_2.push({
              t: parseFloat(observations.downstream[i].value),
              y: observations.downstream[i].dateTime
            });
          }
        }
      }
    })
    .catch(error => console.log(error));

    return hasUpstreamDownstream;
  }

}

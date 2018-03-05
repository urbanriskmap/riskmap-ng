import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as topojson from 'topojson-client';

import { environment as env } from '../../environments/environment';

@Injectable()
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  getData(
    layer: {
      name: string,
      present: boolean,
      server: string,
      useRegionFlag: boolean,
      responseType: string
    },
    region: string
  ): Promise<any> {
    let endpoint = env.servers[layer.server] + layer.name;
    if (layer.useRegionFlag) {
      endpoint = endpoint + '?city=' + region;
      if (layer.name === 'reports') {
        endpoint = endpoint + '&timeperiod=' + env.servers.settings.reportTimeperiod;
      }
    }

    return new Promise((resolve, reject) => {
      this.http
      .get(endpoint)
      .subscribe(response => {

        if (response['statusCode'] === 200) {

          if (layer.responseType === 'topojson') {
            // TOPOJSON
            const topojsonData = response['result'];
            if (topojsonData && topojsonData.objects) {
              const geojsonData = topojson.feature(topojsonData, topojsonData.objects.output);
              resolve(geojsonData);
            }
          } else {
            // GEOJSON
            resolve(response['body']);
          }

        } else {
          reject(response);
        }
      });
    });
  }
}

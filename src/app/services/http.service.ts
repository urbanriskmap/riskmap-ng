import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as topojson from 'topojson-client';

import { environment as env } from '../../environments/environment';

@Injectable()
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  getGeometryData(
    layer: {
      name: string,
      server: string,
      useRegionFlag: boolean,
      responseType: string
    },
    region: string
  ): Promise<{
    type: string,
    features: {
      type: string,
      geometry: {
        type: string,
        coordinates: number[]
      },
      properties: any
    }[]
  }> {
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

  getJsonData(
    server: string,
    endpoint: string,
    flags: {
      key: string,
      value: string
    }[]|null
  ): Promise<any> {
    let queryUrl = env.servers[server] + endpoint;

    if (flags && flags.length) {
      let flagCount = 0;

      for (const flag of flags) {
        if (flag && flag.key) {
          if (flagCount === 0) {
            queryUrl = queryUrl + '?' + flag.key + '=' + flag.value;
            flagCount += 1;
          } else {
            queryUrl = queryUrl + '&' + flag.key + '=' + flag.value;
          }
        }
      }
    }

    return new Promise((resolve, reject) => {
      this.http
      .get(queryUrl)
      .subscribe(response => {
        if (response['statusCode'] === 200) {
          resolve(response['body']);
        } else {
          reject(response);
        }
      });
    });
  }
}

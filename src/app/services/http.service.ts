/// <reference types="geojson" />

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as topojson from 'topojson-client';
import { FeatureCollection, GeometryObject, GeoJsonProperties } from 'geojson';

import { environment as env } from '../../environments/environment';
import { LayerMetadata } from '../interfaces';

@Injectable()
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  fetchGeojson(
    endpoint: string
  ): Promise<FeatureCollection<GeometryObject, GeoJsonProperties>> {
    return new Promise((resolve, reject) => {
      this.http
      .get(endpoint)
      .subscribe(
        response => {
          if (response['statusCode'] === 200) {
            resolve(response['result']);
          } else {
            reject(response);
          }
        },
        error => reject(error)
      );
    });
  }

  convertTopojsonToGeojson(
    endpoint: string
  ): Promise<FeatureCollection<GeometryObject, GeoJsonProperties>> {
    return new Promise((resolve, reject) => {
      this.http
      .get(endpoint)
      .subscribe(
        response => {
          if (response && response['statusCode'] === 200) {
            const topojsonData = response['result'];
            if (topojsonData && topojsonData.objects) {
              const geojsonData = topojson.feature(topojsonData, topojsonData.objects.output);
              resolve(geojsonData);
            }
          } else {
            reject(response);
          }
        },
        error => reject(error)
      );
    });
  }

  simpleFetchGeometry(
    server: string,
    path?: string
  ): Promise<FeatureCollection<GeometryObject, GeoJsonProperties>> {
    // Set to data server
    let endpoint = server;
    // Add additional path routes
    if (path) {
      endpoint = endpoint + path;
    }

    return new Promise((resolve, reject) => {
      this.convertTopojsonToGeojson(endpoint)
      .then(geojson => {
        resolve(geojson);
      })
      .catch(error => {
        reject(error)
      });
    })
    ;
  }

  getGeometryData(
    layer: LayerMetadata,
    region: string,
    miscellaneous?: {
      [name: string]: any
    }
  ): Promise<FeatureCollection<GeometryObject, GeoJsonProperties>> {
    // Set to data server
    let endpoint = env.servers[layer.server];
    // Add additional path routes
    if (layer.path) {
      endpoint = endpoint + layer.path;
    }

    // Add query parameters
    if (layer.flags['region']) {
      endpoint = endpoint + '?city=' + region;
      if (layer.name === 'reports') {
        endpoint = endpoint + '&timeperiod=' + env.servers.settings.reportTimeperiod;
      }
    }

    if (layer.responseType === 'topojson') {
      return this.convertTopojsonToGeojson(endpoint);
    } else {
      // GEOJSON
      return this.fetchGeojson(endpoint);
    }
  }

  getJsonData(
    server: string,
    endpoint: string,
    flags: {
      [name: string]: any
    }[]
  ): Promise<GeoJsonProperties> {
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

    return this.fetchGeojson(queryUrl);
  }

  updateVotes(
    pkey: string,
    points: number
  ): void {
    const endpoint = env.servers.data + 'reports/' + pkey;

    this.http
    .patch(endpoint, {
      points: points
    })
    .subscribe(
      response => {
        console.log('Success');
      },
      error => {
        console.log('Failed');
        console.log(error);
      }
    );
  }
}

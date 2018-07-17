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

  fetchJson(
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
            resolve();
            // COMBAK reject(response);
          }
        },
        error => resolve() // COMBAK reject(error)
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
        reject(error);
      });
    })
    ;
  }

  getGeometryData(
    layer: LayerMetadata,
    region: string,
    miscellaneous?: { // REVIEW vestige?
      [name: string]: any
    }
  ): Promise<FeatureCollection<GeometryObject, GeoJsonProperties>> {
    // Set to data server
    let queryUrl = env.servers[layer.server];
    // Add additional path routes
    if (layer.path) {
      queryUrl += layer.path;
    }

    // Add query parameters
    let isFirstFlag = true;
    for (const flag of layer.flags) {
      if (flag.hasOwnProperty('region')) {
        isFirstFlag = false;
        queryUrl += '?city=' + region;

        if (layer.name === 'reports') {
          queryUrl += '&timeperiod=' + env.servers.settings.reportTimeperiod;
        }
      } else {
        queryUrl += (isFirstFlag ? '?' : '&') + Object.entries(flag)[0][0] + '=' + Object.entries(flag)[0][1];
        isFirstFlag = false;
      }
    }

    if (layer.responseType === 'topojson') {
      // TOPOJSON
      return this.convertTopojsonToGeojson(queryUrl);
    } else {
      // GEOJSON
      return this.fetchJson(queryUrl);
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
      let isFirstFlag = true;
      for (const flag of flags) {
        queryUrl += (isFirstFlag ? '?' : '&') + Object.entries(flag)[0][0] + '=' + Object.entries(flag)[0][1];
        isFirstFlag = false;
      }
    }

    return this.fetchJson(queryUrl);
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

/// <reference types="geojson" />

import { Injectable } from '@angular/core';
import { FeatureCollection, Feature, GeometryObject, GeoJsonProperties } from 'geojson';

import { HttpService } from './http.service';

@Injectable()
export class SensorService {

  constructor(
    private httpService: HttpService
  ) { }

  /**
   * Get stored data for sensor & transform its properties
   * @param sensor Geojson feature
   * @returns Promise that fulfills when properties are fetched and transformed
   */
  fetchAndTransformData(
    sensor: Feature<GeometryObject, GeoJsonProperties>,
    server: string,
    path: string,
    flags: {
      [name: string]: any
    }[]
  ): Promise<Feature<GeometryObject, GeoJsonProperties>> {
    return new Promise((resolve, reject) => {
      // Get sensor observations
      this.httpService
      .getJsonData(
        server,
        path + sensor.properties['id'],
        flags
      )
      .then(observationGroups => {
        if (observationGroups.length) {
          const latestObs = observationGroups[observationGroups.length - 1];

          // Append sensor observations to sensor properties
          if (latestObs.properties.hasOwnProperty('observations')) {
            const observations = latestObs.properties.observations;

            if (Array.isArray(observations)) {
              // Case: Without upstream / downstream values
              if (observations.length) {
                sensor.properties.observations = observations;
              }
            } else {

              // Case: With upstream / downstream values
              if (
                observations.hasOwnProperty('upstream')
                && Array.isArray(observations.upstream)
                && observations.upstream.length
              ) {
                sensor.properties.observations = observations;
              }
            }
          }
        }

        // move feature.properties.properties (JSON) to feature.properties
        for (const prop in sensor.properties.properties) {
          if (prop) {
            sensor.properties[prop] = sensor.properties.properties[prop];
          }
        }
        delete sensor.properties.properties;

        // Store sensor in array of promises
        resolve(sensor);
      })
      .catch(error => reject(error));
    });
  }

  updateProperties(
    geojson: FeatureCollection<GeometryObject, GeoJsonProperties>,
    server: string,
    path: string,
    flags: {
      [name: string]: any
    }[]
  ): Promise<Feature<GeometryObject, GeoJsonProperties>[]> {
    const fetchAndTransformProcesses = [];

    for (const sensor of geojson.features) {
      // TODO: remove if after removing sensor 54
      if (sensor.properties.id !== '54') {
        // Ref https://daveceddia.com/waiting-for-promises-in-a-loop/
        fetchAndTransformProcesses.push(this.fetchAndTransformData(sensor, server, path, flags));
      }
    }

    return new Promise ((resolve, reject) => {
      Promise.all(fetchAndTransformProcesses)
      .then(sensors => {
        resolve(sensors);
      })
      .catch(error => reject(error));
    });
  }
}

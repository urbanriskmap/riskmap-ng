/// <reference types="geojson" />

import { Injectable } from '@angular/core';
import { FeatureCollection, Feature, Point, GeoJsonProperties } from 'geojson';

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
    sensor: Feature<Point, GeoJsonProperties>
  ): Promise<Feature<Point, GeoJsonProperties>> {
    return new Promise((resolve, reject) => {
      // Get sensor observations
      this.httpService
      .getJsonData(
        'sensors',
        'sensors/' + sensor.properties['id'],
        null
      )
      .then(observationGroups => {
        if (observationGroups.length) {
          const latestObs = observationGroups[observationGroups.length - 1];

          // Append sensor observations to sensor properties
          if (Array.isArray(latestObs.properties.observations)) {
            // Case: Without upstream / downstream values
            if (latestObs.properties.observations.length) {
              sensor.properties.observations = latestObs.properties.observations;
            }
          } else {

            // Case: With upstream / downstream values
            if (
              latestObs.properties.observations.hasOwnProperty('upstream')
              && Array.isArray(latestObs.properties.observations.upstream)
              && latestObs.properties.observations.upstream.length
            ) {
              sensor.properties.observations = latestObs.properties.observations;
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
    geojson: FeatureCollection<Point, GeoJsonProperties>
  ): Promise<Feature<Point, GeoJsonProperties>[]> {
    const fetchAndTransformProcesses = [];

    for (const sensor of geojson.features) {
      // Ref https://daveceddia.com/waiting-for-promises-in-a-loop/
      fetchAndTransformProcesses.push(this.fetchAndTransformData(sensor));
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

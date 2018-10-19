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
        path + sensor.properties['id'], // TODO: get uniqueKey from LayerMetadata
        flags
      )
      .then(observationGroups => {
        if (observationGroups && observationGroups.length) {
          const latestObs = observationGroups[0];

          // Append sensor observations to sensor properties
          if (latestObs.properties.hasOwnProperty('observations')) {
            const observations = latestObs.properties.observations;

            if (
              flags.length
              && flags[0].hasOwnProperty('type')
            ) {
              if (
                flags[0].type === 'water_level'
                && observations.length
              ) {
                // First call made for water_level
                sensor.properties.observations = {water_level: observations};
              } else if (
                flags[0].type === 'predictions'
                && observations.length
              ) {
                // Second call made for predictions,
                // check if observations object was initialized for water_level
                if (!sensor.properties.hasOwnProperty('observations')) {
                  sensor.properties.observations = {};
                }
                sensor.properties.observations.predictions = observations;
              } else {
                // SFWMD
                sensor.properties.observations = observations;
              }
            } else {
              // USGS
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
      // Ref https://daveceddia.com/waiting-for-promises-in-a-loop/
      fetchAndTransformProcesses.push(this.fetchAndTransformData(sensor, server, path, flags));
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

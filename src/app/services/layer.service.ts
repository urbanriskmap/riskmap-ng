import { Injectable } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

import { environment as env } from '../../environments/environment';
import { HttpService } from './http.service';

@Injectable()
export class LayerService {
  map: mapboxgl.Map;

  constructor(
    private httpService: HttpService
  ) { }

  updateSensorProperties(geojson, settings): Promise<{
    type: string,
    geometry: {
      type: string,
      coordinates: number[],
    },
    properties: any,
  }[]> {
    const fetchSensorData = <Promise[]>[];

    for (const sensor of geojson.features) {
      fetchSensorData.push(
        new Promise((resolve, reject) => {
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
      )
    }

    return new Promise ((resolve, reject) => {
      Promise.all(fetchSensorData)
      .then(sensors => {
        resolve(sensors);
      })
      .catch(error => reject(error));
    });
  }

  initializeLayers(
    map: mapboxgl.Map,
    region: {
      name: string,
      code: string,
      bounds: {
        sw: number[],
        ne: number[]
      }
    }
  ) {
    this.map = map;

    for (const layer of env.supportedLayers) {

      switch (layer.metadata.name) {
        case 'sensors':
          this.httpService
          .getGeometryData(layer.metadata, region.code)
          .then(geojson => {
            this.updateSensorProperties(geojson, layer.settings)
            .then(updatedSensors => {
              geojson.features = updatedSensors;
              layer.settings.source.data = geojson;

              // Add layer
              this.map.addLayer(layer.settings);
            })
            .catch(error => console.log(error));
          });
          break;

        default:
          this.httpService
          .getGeometryData(layer.metadata, region.code)
          .then(geojson => {
            // Overwrite data object
            layer.settings.source.data = geojson;
            // Add layer
            this.map.addLayer(layer.settings);
          });
      }
    }
  }
}

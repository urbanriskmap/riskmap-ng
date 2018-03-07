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

  updateSensorProperties(geojson, settings) {
    const sensors = [];

    return new Promise((resolve, reject) => {
      for (const sensor of geojson.features) {
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
            const lastUpdate = new Date(latestObs.created); // timestamp when latest data entry was created

            // Set thresholdDate to 'x' hours ago (subtract milliseconds)
            const thresholdDate = new Date(Date.parse((new Date()).toISOString()) - (24 * 60 * 60 * 1000));

            // Append sensor observations to sensor properties
            if (Array.isArray(latestObs.properties.observations)) {
              // Without upstream / downstream values
              if (latestObs.properties.observations.length) {
                sensor.properties.observations = latestObs.properties.observations;
              }
            } else {

              // With upstream / downstream values
              if (
                latestObs.properties.observations.hasOwnProperty('upstream')
                && Array.isArray(latestObs.properties.observations.upstream)
                && latestObs.properties.observations.upstream.length
              ) {
                sensor.properties.observations = latestObs.properties.observations;
              }
            }

            // Append recent property only if updated after thresholdDate
            if (lastUpdate > thresholdDate) {
              sensor.properties.recent = true;
            } else {
              sensor.properties.recent = false;
            }
          }

          sensors.push(sensor);
        })
        .catch(error => console.log(error));
      }

      resolve(sensors);
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
            .then(sensors => {
              // Overwrite layer data object
              geojson.features = sensors;
              layer.settings.source.data = geojson;

              console.log(layer.settings);

              // Add layer
              this.map.addLayer(layer.settings);
            });
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

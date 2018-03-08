import { Injectable } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

import { environment as env } from '../../environments/environment';
import { HttpService } from './http.service';
import { SensorService } from './sensor.service';
import { InteractionService } from './interaction.service';

@Injectable()
export class LayerService {
  map: mapboxgl.Map;

  constructor(
    private httpService: HttpService,
    private sensorService: SensorService,
    public interactionService: InteractionService
  ) { }

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
            this.sensorService.updateProperties(geojson)
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

  handleMapInteraction(
    event: {
      type: string,
      lngLat: {
        lng: number,
        lat: number
      },
      point: {
        x: number,
        y: number
      },
      originalEvent: object,
      target: object
    }
  ) {
    for (const layer of env.supportedLayers) {
      const name = layer.metadata.name;
      // Store rendered features filtered by layer name
      const features = this.map.queryRenderedFeatures(event.point, {layers: [name]});

      if (features.length === 1) {
        this.interactionService.handleLayerInteraction(name, features);
        break;

      } else if (features.length > 1) {
        // use clustering to show all features
        // Ref https://www.mapbox.com/mapbox-gl-js/example/cluster/

        this.interactionService.handleLayerInteraction(name, features);
        break;

      } else {
        this.interactionService.handleLayerInteraction();
      }
    }
  }
}

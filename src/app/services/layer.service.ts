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
    event?: {
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
      const uniqueKey = layer.metadata.uniqueKey;
      let hasSelectedFeature: boolean;

      // Check if a selection layer is active
      if (event && this.map.getLayer('sel' + name)) {
        hasSelectedFeature = (this.map.queryRenderedFeatures(event.point, {layers: ['sel' + name]})).length > 0;
      }

      if (hasSelectedFeature) {
        // CASE: If clicked on a previously selected feature
        this.clearSelectionLayer(name);
        this.interactionService.handleLayerInteraction();
        break;
      } else {
        // Store rendered features filtered by layer name
        let features = [];

        if (event) {
          features = this.map.queryRenderedFeatures(event.point, {layers: [name]});
        }

        if (features.length === 1) {
          // CASE: Clicked on a single feature
          this.clearSelectionLayer(name);
          this.addSelectionLayer(name, uniqueKey, features);
          this.interactionService.handleLayerInteraction(name, features);
          break;

        } else if (features.length > 1) {
          // CASE: Clicked with multiple features overlapping
          // TODO: use clustering to show all features
          // Ref https://www.mapbox.com/mapbox-gl-js/example/cluster/

          this.interactionService.handleLayerInteraction(name, features);
          break;

        } else {
          // CASE: If clicked on empty map canvas
          // OR clicked on Menu button
          this.clearSelectionLayer(name);
          this.interactionService.handleLayerInteraction();
        }
      }
    }
  }

  clearSelectionLayer(name: string): void {
    if (this.map.getLayer('sel' + name)) {
      this.map.removeLayer('sel' + name);
      this.map.removeSource('sel' + name);
    }
  }

  addSelectionLayer(layerName?: string, uniqueKey?: string, features?: object): void {
    let layerSettings;

    for (const layer of env.supportedLayers) {
      if (layerName === layer.metadata.name) {
        // modify settings of original layer
        layer.settings.id = 'sel' + layerName;
        layer.settings.source.data = this.map.getSource(layer.metadata.name)._data;
        layer.settings['filter'] = ['==', uniqueKey, features[0].properties[uniqueKey]];
        layer.settings[layer.metadata.selected.type] = layer.metadata.selected.style;

        layerSettings = layer.settings;
      }
    }

    if (layerSettings) {
      // add selected feature layer
      this.map.addLayer(layerSettings);
    }
  }
}

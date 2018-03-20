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
  ): void {
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
              this.map.addLayer(layer.settings, layer.metadata['placeBelow']);
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
            this.map.addLayer(layer.settings, layer.metadata['placeBelow']);
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
    if (event) {
      if (this.clearSelectionLayers(event.point)) {
        // CASE: Clicked over a previously selected feature
        // Deselect feature & exit function
        this.interactionService.handleLayerInteraction();

      } else {
        // Iterate over all layers
        for (const layer of env.supportedLayers) {
          const name = layer.metadata.name;
          const uniqueKey = layer.metadata.uniqueKey;
          let features = [];
          if (this.map.getLayer(name)) {
            features = this.map.queryRenderedFeatures(event.point, {layers: [name]});
          }

          if (features.length === 1) {
            // CASE: Clicked on a single feature
            this.addSelectionLayer(name, uniqueKey, features);
            this.interactionService.handleLayerInteraction(name, features);
            break;

          } else if (features.length > 1) {
            // CASE: Clicked with multiple features overlapping
            // TODO: use clustering to show all features
            // Ref https://www.mapbox.com/mapbox-gl-js/example/cluster/
            this.interactionService.handleLayerInteraction(name, features);

            // FIXME: Fails when features from 2 different layers are overlapping
            // only first layer encountered is selected (report behind flood polygon case?)
            break;

          } else {
            // CASE: No feature found in layer being iterated over
            this.interactionService.handleLayerInteraction();
          }
        }
      }
    } else {
      // CASE: Clicked on Menu button,
      // non-map interaction event
      if (this.map) {
        this.clearSelectionLayers();
      }
      this.interactionService.handleLayerInteraction();
    }
  }

  clearSelectionLayers(
    point?: {
      x: number,
      y: number
    }
  ): boolean {
    let hasSelectedFeature = false;

    for (const layer of env.supportedLayers) {
      const selLayerName = 'sel' + layer.metadata.name;

      if (this.map.getLayer(selLayerName)) {
        // Check if a selection layer is active
        if (point) {
          hasSelectedFeature = (this.map.queryRenderedFeatures(point, {layers: [selLayerName]})).length > 0;
        }

        // Remove selected feature layers
        this.map.removeLayer(selLayerName);
        this.map.removeSource(selLayerName);
      }

      if (hasSelectedFeature) {
        return true;
      }
    }
  }

  addSelectionLayer(layerName?: string, uniqueKey?: string, features?: any): void {
    const layerSettings: { [name: string]: any} = {};

    for (const layer of env.supportedLayers) {
      if (layerName === layer.metadata.name) {
        // modify settings of original layer
        layerSettings.id = 'sel' + layerName;
        layerSettings.type = layer.settings.type;
        layerSettings.source = {
          type: layer.settings.source.type,
          data: this.map.getSource(layer.metadata.name)._data
        };
        layerSettings.filter = ['==', uniqueKey, features[0].properties[uniqueKey]];
        layerSettings[layer.metadata.selected.type] = layer.metadata.selected.style;
      }
    }

    if (layerSettings) {
      // add selected feature layer
      this.map.addLayer(layerSettings);
    }
  }
}

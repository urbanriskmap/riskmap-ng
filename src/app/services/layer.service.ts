import { Injectable } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

import { environment as env } from '../../environments/environment';
import layers from '../../resources/layers';
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

  addSelectionLayer(
    settings: any,
    selection: any,
    placeBelow: string
  ): void {
    const layerSettings: { [name: string]: any} = {};

    // modify settings of original layer
    layerSettings.id = 'sel' + settings.id;
    layerSettings.type = settings.type;
    layerSettings.source = settings.source;
    layerSettings[selection.type] = selection.style;

    const featureFilter = settings.filter.slice(-1).pop();
    featureFilter.splice(0, 1, '==');

    settings.filter.splice(-1, 1, featureFilter);
    layerSettings.filter = settings.filter;

    // add selected feature layer
    this.map.addLayer(layerSettings);
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
  ): void {
    this.map = map;

    for (const layer of layers.supported) {

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
              // Add selection layer
              this.addSelectionLayer(layer.settings, layer.metadata.selected, layer.metadata['placeBelow']);
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
            // Add base layer
            this.map.addLayer(layer.settings, layer.metadata['placeBelow']);
            // Add selection layer
            this.addSelectionLayer(layer.settings, layer.metadata.selected, layer.metadata['placeBelow']);
          });
      }
    }
  }

  modifyLayerFilter(layerName: string, uniqueKey: string|null, features: any, restore?: boolean): void {
    // Get filter for queried layer
    const filter = this.map.getFilter(layerName);

    // Extract last item in filter array
    const featureFilter = filter.slice(-1).pop();

    // Replace 'value' item in ['operator', 'key', 'value'] array
    const value = restore ? '' : features[0].properties[uniqueKey];
    featureFilter.splice(-1, 1, value);
    // Replace featureFilter in queried layer filter
    filter.splice(-1, 1, featureFilter);

    // Update filter for base layer
    this.map.setFilter(layerName, filter);

    // Invert 'operator' from '!=' to '==' for selectionFilter
    const selectionFilter = featureFilter;
    selectionFilter.splice(0, 1, '==');
    // Replace selectionFilter in queried layer's selection counterpart
    filter.splice(-1, 1, selectionFilter);

    // Update filter for selection layer
    this.map.setFilter('sel' + layerName, filter);
  }

  clearSelectionLayers(
    point?: {
      x: number,
      y: number
    }
  ): boolean {
    let hasSelectedFeature = false;

    for (const layer of layers.supported) {
      const layerName = layer.metadata.name;

      // Prevent method execution before layer have loaded
      if (this.map.getLayer(layerName)) {

        const filter = this.map.getFilter(layerName);
        const featureFilter = filter.slice(-1).pop();

        if (featureFilter[2] !== '') {
          // Base layer filter has no unique identifier value
          // Thus, layer has a selected feature

          if (point) {
            // Clicked again on a selected feature?
            hasSelectedFeature = (this.map.queryRenderedFeatures(point, {layers: ['sel' + layerName]})).length > 0;
          }

          // Restore base layer and selection layer filters
          this.modifyLayerFilter(layerName, null, null, true);
        }

        if (hasSelectedFeature) {
          return true;
        }
      }
    }

    return false;
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
        // CASE 1: Clicked over a previously selected feature
        // Deselect feature & exit function
        this.interactionService.handleLayerInteraction();

      } else {
        // Iterate over all layers
        for (const layer of layers.supported) {
          const name = layer.metadata.name;
          const uniqueKey = layer.metadata.uniqueKey;
          let features = [];
          if (this.map.getLayer(name)) {
            features = this.map.queryRenderedFeatures(event.point, {layers: [name]});
          }

          if (features.length === 1) {
            // CASE 2: Clicked on a single feature
            this.modifyLayerFilter(name, uniqueKey, features);
            this.interactionService.handleLayerInteraction(name, features);
            break;

          } else if (features.length > 1) {
            // CASE 3: Clicked with multiple features overlapping
            // TODO: use clustering to show all features
            // Ref https://www.mapbox.com/mapbox-gl-js/example/cluster/
            this.interactionService.handleLayerInteraction(name, features);

            // FIXME: Fails when features from 2 different layers are overlapping
            // only first layer encountered is selected (report behind flood polygon case?)
            break;

          } else {
            // CASE 4: No feature found in layer being iterated over
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
}

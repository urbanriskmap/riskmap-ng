/// <reference types="geojson" />

import { Injectable, EventEmitter } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Feature, GeometryObject, GeoJsonProperties } from 'geojson';

import { environment as env } from '../../environments/environment';
import layers from '../../resources/layers';
import { HttpService } from './http.service';
import { SensorService } from './sensor.service';
import { InteractionService } from './interaction.service';
import { NotificationService } from './notification.service';
import { Region, LayerMetadata, LayerSettings } from '../interfaces';

@Injectable()
export class LayerService {
  map: mapboxgl.Map;
  layers: {
    metadata: LayerMetadata,
    settings: LayerSettings
  }[];
  notify: EventEmitter<{
    msg: string,
    type: 'info' | 'warn' | 'error',
    actionText?: string
  }>;

  constructor(
    private httpService: HttpService,
    private notificationService: NotificationService,
    private sensorService: SensorService,
    public interactionService: InteractionService
  ) {
    this.layers = layers;
  }

  addSelectionLayer(
    settings: any,
    selected: any,
    placeBelow: string
  ): void {
    const layerSettings: { [name: string]: any } = {};

    // modify settings of original layer
    layerSettings.id = 'sel' + settings.id;
    layerSettings.type = settings.type;
    layerSettings.source = settings.source;

    // REVIEW: each layer style may only have either paint or layout properties (?)
    layerSettings[selected.type] = settings[selected.type];

    // Override selected style properties
    const propsToChange = Object.keys(selected.styles);
    for (const prop of propsToChange) {
      if (prop) {
        layerSettings[selected.type][prop] = selected.styles[prop];
      }
    }

    // Invert global layer filter (last item in array)
    const featureFilter = settings.filter.slice(-1).pop();
    featureFilter.splice(0, 1, '==');
    settings.filter.splice(-1, 1, featureFilter);
    layerSettings.filter = settings.filter;

    // add selected feature layer
    this.map.addLayer(layerSettings);
  }

  initializeLayers(
    map: mapboxgl.Map,
    region: Region
  ): void {
    this.map = map;

    for (const layer of layers.supported) {

      switch (layer.metadata.name) {
        case 'sensors':
          this.httpService
          .getGeometryData(layer.metadata, region.code)
          .then(geojson => {
            this.sensorService.updateProperties(geojson, layer.metadata.server, layer.metadata.path, layer.metadata.flags)
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

            if (layer.metadata.name === 'reports') {
              this.showReportsNotification(geojson.features.length);
            }

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

  addSingleReportToLayer(
    pkey: number
  ): Promise<Feature<GeometryObject, GeoJsonProperties>> {
    return new Promise((resolve, reject) => {
      this.httpService
        .simpleFetchGeometry(env.servers.data, 'reports/' + pkey)
        .then(report => {
          const loadedData = this.map.getSource('selreports')._data;
          loadedData.features.push(report.features[0]);
          this.map.getSource('selreports').setData(loadedData);
          resolve(report.features[0]);
        })
        .catch(error => {
          // Show notification if queried report id not found
          const msg = 'Report with id: ' + pkey + ' does not exist';
          this.notificationService.notify(msg, 'info');
          reject(error);
        });
    });
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
  ): void {
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
            this.interactionService.handleLayerInteraction(name, layer.metadata.viewOnly, features);
            break;

          } else if (features.length > 1) {
            // CASE 3: Clicked with multiple features overlapping
            this.modifyLayerFilter(name, uniqueKey, features);
            this.interactionService.handleLayerInteraction(name, layer.metadata.viewOnly, features);

            // Susceptible to fail when features from 2 different layers are overlapping;
            // only first layer encountered is selected (report behind flood polygon case)
            // NOTE: RESOLVED by using placeBelow key of LayerMetadata
            // Catch in tests
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

  showReportsNotification(reports: number): void {
    const timeperiod = env.servers.settings.reportTimeperiod / 3600;
    let msg;

    switch (reports) {
      case 0:
        msg = 'No report received in past ' + timeperiod + ' hrs';
        break;

      case 1:
        msg = 'Recieved 1 report in past ' + timeperiod + ' hrs';
        break;

      default:
        msg = 'Recieved ' + reports + ' report in past ' + timeperiod + ' hrs';
    }

    this.notificationService.notify(msg, 'info');
  }
}

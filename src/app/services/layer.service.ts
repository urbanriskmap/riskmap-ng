/// <reference types="geojson" />

import { Injectable, EventEmitter } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Feature, FeatureCollection, GeometryObject, GeoJsonProperties } from 'geojson';

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
  basins: {
    basinCode: string,
    sites: {
      name: string,
      stations: {
        id: string,
        class: string,
        controlElevation?: number,
        stationId: string,
        units: string
      }[]
    }[]
  }[];

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

    // NOTE: JS value vs reference assignment
    // For any properties that need to be modified after assignment to local var,
    // eg. selection layer icon, filter, etc.
    // parse a converted string value from layers.ts
    // to avoid making changes to layers metadata & settings
    layerSettings[selected.type] = JSON.parse(JSON.stringify(settings[selected.type]));

    // Override selected style properties
    const propsToChange = Object.keys(selected.styles);
    for (const prop of propsToChange) {
      if (prop) {
        layerSettings[selected.type][prop] = selected.styles[prop];
      }
    }

    // Invert global layer filter (last item in array)
    const selectionFilter = JSON.parse(JSON.stringify(settings.filter));
    const featureFilter = selectionFilter.slice(-1).pop();
    featureFilter.splice(0, 1, '==');
    selectionFilter.splice(-1, 1, featureFilter);
    layerSettings.filter = selectionFilter;

    // add selected feature layer
    this.map.addLayer(layerSettings, placeBelow);
  }

  addSensorLayers(
    geojson: FeatureCollection<GeometryObject, GeoJsonProperties>,
    server: string,
    path: string,
    flags: {[name: string]: any}[]
  ) {
    return new Promise((resolve, reject) => {
      this.sensorService.updateProperties(geojson, server, path, flags)
      .then(updatedSensors => {
        geojson.features = updatedSensors;
        resolve(geojson);
      })
      .catch(error => reject(error));
    });
  }

  renderLayers(settings, selectionSettings, placeBelow) {
    // Add base layer
    this.map.addLayer(settings, placeBelow);
    // Add selection layer
    this.addSelectionLayer(settings, selectionSettings, placeBelow);
  }

  initializeLayers(
    region: Region,
    adminMode: boolean
  ): void {
    // Iterate over supported layers
    for (const layer of layers.supported) {
      // Filter layers based on publicAccess, or adminMode check
      if (layer.metadata.publicAccess || adminMode) {

        // Get geometry data
        this.httpService
        .getGeometryData(layer.metadata, region.code)
        .then(geojson => {
          switch (layer.metadata.name) {
            // REVIEW: All following cases will be deployment specific
            // Worth refactoring?
            case 'sensors_usgs':
              this.addSensorLayers(geojson, layer.metadata.server, layer.metadata.path, layer.metadata.flags)
              .then((data) => {
                if (data) {
                  layer.settings.source.data = data;
                  this.renderLayers(layer.settings, layer.metadata.selected, layer.metadata['placeBelow']);
                }
              })
              .catch((error) => console.log(error));
              break;

            case 'sensors_sfwmd':
              // Fetch and join timeseries data to stations, aggregate data fetched during basin, site joining
              this.addSensorLayers(geojson, layer.metadata.server, layer.metadata.path, [{type: 'timeseries'}])
              .then((data) => {
                if (data) {
                  layer.settings.source.data = data;
                  this.renderLayers(layer.settings, layer.metadata.selected, layer.metadata['placeBelow']);
                  this.linkSfwmdInfrastructure(data['features']);
                }
              })
              .catch((error) => console.log(error));
              break;

            case 'sensors_noaa':
              this.addSensorLayers(geojson, layer.metadata.server, layer.metadata.path, [{type: 'water_level'}])
              .then((withWaterLevelData: FeatureCollection<GeometryObject, GeoJsonProperties>) => {
                if (withWaterLevelData) {
                  // Parse water_level data
                  const waterLevelData = withWaterLevelData.features[0].properties.observations.water_level;

                  this.addSensorLayers(withWaterLevelData, layer.metadata.server, layer.metadata.path, [{type: 'predictions'}])
                  .then((withPredictionsData: FeatureCollection<GeometryObject, GeoJsonProperties>) => {
                    // TODO: currently following code block works for single layer feature
                    // Loop over features when multiple stations are added

                    // Parse predictions data
                    const predictionsData = withPredictionsData.features[0].properties.observations.predictions;

                    // Append to previously fetched feature with water_level data
                    withWaterLevelData.features[0].properties.observations = {
                      water_level: waterLevelData,
                      predictions: predictionsData
                    };

                    // Set geojson source in layer settings
                    layer.settings.source.data = withWaterLevelData;
                    this.renderLayers(layer.settings, layer.metadata.selected, layer.metadata['placeBelow']);
                  })
                  .catch((error) => console.log(error));
                }
              })
              .catch((error) => console.log(error));
              break;

            default:
              if (layer.metadata.name === 'reports') {
                this.showReportsNotification(geojson.features.length);
              }
              // Overwrite data object
              layer.settings.source.data = geojson;
              this.renderLayers(layer.settings, layer.metadata.selected, layer.metadata['placeBelow']);
          }
        })
        .catch(error => console.log(error));
      }
    }
  }

  linkSfwmdInfrastructure(stations: {[name: string]: any}[]): void {
    this.basins = [];
    for (const station of stations) {
      const _b = station.properties.basin;
      const _s = station.properties.site;
      const _id = station.properties.id;
      const _class = station.properties.class;
      const _ce = station.properties.controlElevation;
      const _uid = station.properties.stationId;
      const _u = station.properties.units;

      // Lookup matching basin
      const basinStored = this.basins.filter((basin) => {
        return basin.basinCode === _b;
      }).length;
      if (basinStored) {
        // Go to matching basin
        for (const basin of this.basins) {

          if (basin.basinCode === _b) {
            // Lookup matching site
            const siteStored = basin.sites.filter((site) => {
              return site.name === _s;
            }).length;
            if (siteStored) {
              // Go to matching site
              for (const site of basin.sites) {
                if (site.name === _s) {
                  site.stations.push({
                    id: _id,
                    class: _class,
                    controlElevation: _ce,
                    stationId: _uid,
                    units: _u
                  });
                }
              }

            } else {
              // site not stored
              basin.sites.push({
                name: String(_s),
                stations: [{
                  id: _id,
                  class: _class,
                  controlElevation: _ce,
                  stationId: _uid,
                  units: _u
                }]
              });
            }
          }
        }

      } else {
        // basin not stored
        this.basins.push({
          basinCode: String(_b),
          sites: [{
            name: String(_s),
            stations: [{
              id: _id,
              class: _class,
              controlElevation: _ce,
              stationId: _uid,
              units: _u
            }]
          }]
        });
      }
    }
  }

  getNestedProperties(uniqueKey: string, properties: any) {
    try {
      return uniqueKey
        .split('.')
        .reduce((object, property) => {
          if (typeof object === 'string') {
            return JSON.parse(object)[property];
          } else {
            return object[property];
          }
        }, properties);
    } catch (err) {
      return properties[uniqueKey];
    }
  }

  modifyLayerFilter(layerName: string, uniqueKey: string|null, features: any, restore?: boolean): void {
    // Get filter for queried layer
    const filter = this.map.getFilter(layerName);

    // Extract last item in filter array
    const featureFilter = filter.slice(-1).pop();

    // Replace 'value' item in ['operator', 'key', 'value'] array
    const value = restore ? '' : this.getNestedProperties(uniqueKey, features[0].properties);
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

  notifyLoadingNotComplete() {
    this.notificationService.notify(
      'Still loading...',
      'info'
    );
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
        // NOTE: In layers.ts file, declare layer objects in the order of click interaction priority

        for (const layer of layers.supported) {
          const name = layer.metadata.name;
          const uniqueKey = layer.metadata.uniqueKey;
          let features = [];
          if (this.map.getLayer(name)) {
            features = this.map.queryRenderedFeatures(event.point, {layers: [name]});
          }

          if (features.length >= 1) {
            // CASE 2: Clicked on a single feature
            // CASE 3: Clicked with multiple features overlapping
              // will select the top-most rendered icon / feature
            this.modifyLayerFilter(name, uniqueKey, features);

            let selectedSite;
            let selectedBasin;

            if (name === 'sites') {
              if (!this.basins || !this.basins.length) {
                this.notifyLoadingNotComplete();
                break;
              }

              for (const basin of this.basins) {
                selectedSite = basin.sites.filter((siteGroup) => {
                  return siteGroup.name === JSON.parse(features[0].properties.tags)['site'];
                });
                if (selectedSite.length) {
                  break;
                }
              }
            }

            if (name === 'basins') {
              if (!this.basins || !this.basins.length) {
                this.notifyLoadingNotComplete();
                break;
              }

              selectedBasin = this.basins.filter((basin) => {
                return basin.basinCode === JSON.parse(features[0].properties.tags)['basin_code'];
              });
            }

            this.interactionService.handleLayerInteraction(name, layer.metadata.viewOnly, features, selectedSite, selectedBasin);
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
        msg = 'Recieved ' + reports + ' reports in past ' + timeperiod + ' hrs';
    }

    this.notificationService.notify(msg, 'info');
  }

  zoomToQueriedReport(report: Feature<GeometryObject, GeoJsonProperties>) {
    this.modifyLayerFilter('reports', 'pkey', [report]);
    this.interactionService.handleLayerInteraction('reports', null, [report]);
    this.map.flyTo({
      zoom: 11,
      center: report.geometry['coordinates']
    });
  }
}

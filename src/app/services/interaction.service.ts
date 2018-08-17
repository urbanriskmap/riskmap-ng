import { Injectable } from '@angular/core';

@Injectable()
export class InteractionService {
  /*
  featureTypes: {
    first_layer_name?: object[],
    second_layer_name?: object[],
    ...
    nth_layer_name?: object[]
  }
  */
  featureTypes = {};
  stations = [];
  sites = [];

  constructor() { }

  handleLayerInteraction(
    name?: string,
    viewOnly?: boolean,
    features?: object[],
    site?: {
      name: string,
      stations: {
        id: string,
        class: string,
        stationId: string,
        units: string
      }[]
    },
    basin?: {
      basinCode: string,
      sites: {
        name: string,
        stations: {
          id: string,
          class: string,
          stationId: string,
          units: string
        }[]
      }[]
    }
  ): void {
    // NOTE: Use switch case if layer names cannot
    // be the same as listed featureTypes

    if (name && !viewOnly) {
      this.clearAllInfoPanes(name);
      this.featureTypes[name] = features;

      switch (name) {
        case 'sites':
          this.stations = site[0].stations;
          break;

        case 'basins':
          this.sites = basin[0].sites;
          break;

        default:
          // Do something
      }
    } else {
      this.clearAllInfoPanes();
    }
  }

  clearAllInfoPanes(excludeLayer?: string): void {
    for (const type in this.featureTypes) {
      if (type && type !== excludeLayer) {
        delete this.featureTypes[type];
      }
    }

    if (this.sites.length && excludeLayer !== 'basins') {
      this.sites = [];
    } else if (this.stations.length && excludeLayer !== 'sites') {
      this.stations = [];
    }
  }
}

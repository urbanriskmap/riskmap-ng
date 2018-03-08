import { Injectable } from '@angular/core';

@Injectable()
export class InteractionService {
  featureTypes: {
    reports?: object,
    sensors?: object
  };

  constructor() {
    this.featureTypes = {};
  }

  handleLayerInteraction(name, feature) {
    // TODO: Use switch case if layer names cannot
    // be the same as listed featureTypes
    if (name) {
      this.clearAllInfoPanes(name);
      this.featureTypes[name] = feature;
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
  }
}

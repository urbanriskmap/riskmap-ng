import { Injectable } from '@angular/core';

import { environment as env } from '../../environments/environment';
import { HttpService } from './http.service';

@Injectable()
export class LayerService {

  constructor(
    private httpService: HttpService
  ) { }

  initializeLayers(
    region: {
      name: string,
      code: string,
      bounds: {
        sw: number[],
        ne: number[]
      }
  }) {
    for (const layer of env.supportedLayers) {
      if (layer.present) {
        console.log(this.httpService.getData(layer, region.code));
      }
      // do something
    }
  }
}

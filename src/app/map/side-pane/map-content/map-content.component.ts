import { Component, OnInit } from '@angular/core';

import layers from '../../../../resources/layers';
import { LayerLegend } from '../../../interfaces';

@Component({
  selector: 'app-map-content',
  templateUrl: './map-content.component.html',
  styleUrls: ['./map-content.component.scss']
})
export class MapContentComponent implements OnInit {
  legend: {
    reports: {
      items: LayerLegend[]
    },
    infrastructure: {
      items: LayerLegend[]
    }
  };

  constructor() {
    this.legend = {
      reports: {items: []},
      infrastructure: {items: []}
    };

    for (const layer of layers.supported) {
      if (layer.metadata.legendGroup) {
        for (const item of layer.legend) {
          this.legend[layer.metadata.legendGroup].items.push(item);
        }
      }
    }

    console.log(this.legend);
  }

  ngOnInit() {
  }

}

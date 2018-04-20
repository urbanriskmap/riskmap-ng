import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import layers from '../../../../resources/layers';
import { LayerLegend, Region } from '../../../interfaces';

@Component({
  selector: 'app-map-content',
  templateUrl: './map-content.component.html',
  styleUrls: ['./map-content.component.scss']
})
export class MapContentComponent implements OnInit {
  @Input() regions: Region[];
  @Input() selectedRegion: Region;

  legend: {
    reports: {
      items: LayerLegend[]
    },
    infrastructure: {
      items: LayerLegend[]
    }
  };

  constructor(
    private router: Router
  ) {
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
  }

  ngOnInit() {
  }

  changeRegion() {
    this.router.navigate([this.selectedRegion.name]);
  }
}

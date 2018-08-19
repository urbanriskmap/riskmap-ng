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
  @Input() adminMode: boolean;
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
  }

  ngOnInit() {
    for (const layer of layers.supported) {
      if (layer.metadata.legendGroup
        && (
          this.adminMode
          || layer.metadata.publicAccess
        )) {
        // Add legend items
        for (const item of layer.legend) {
          this.legend[layer.metadata.legendGroup].items.push(item);
        }
      }
    }
  }

  changeRegion() {
    location.assign(location.origin + '/' + this.selectedRegion.name);
    // this.router.navigate([this.selectedRegion.name]);
  }
}

import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { LayerService } from '../../services/layer.service';
import { SensorInterface } from '../../interfaces';

@Component({
  selector: 'app-site-info',
  templateUrl: './site-info.component.html',
  styleUrls: ['./site-info.component.scss']
})
export class SiteInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() stations: {
    [name: string]: any
  }[];
  @Input() site;
  features: SensorInterface[];

  constructor(
    public layerService: LayerService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('site')) {
      this.features = [];
      let siteStations = [];
      const allStations = this.layerService.map.getSource('sensors_sfwmd')._data.features;

      // NOTE: Cannot use map.querySourceFeatures OR map.queryRenderedFeatures
      // since sensors_sfwmd will not visible when user clicks on a site feature;
      // https://www.mapbox.com/mapbox-gl-js/api#map#queryrenderedfeatures

      // Iterate over station names
      for (let siteStationName of this.stations) {
        // Store filtered features from sensors_sfwmd layer
        siteStations.push(allStations.filter((station) => {
          return siteStationName === station.properties.stationId;
        })[0]);
      }

      for (let station of siteStations) {
        this.features.push([{
          layer: {id: 'sensors_sfwmd'},
          properties: station.properties
        }]);
      }
    }
  }

  ngOnDestroy() {

  }
}

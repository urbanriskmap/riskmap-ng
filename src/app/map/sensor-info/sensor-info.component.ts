import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrls: ['./sensor-info.component.scss']
})
export class SensorInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() features: {
    [name: string]: any
  }[];

  feature: {
    [name: string]: any
  };
  hasUpstreamDownstream: boolean | null;

  constructor(
    private chartService: ChartService
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('features')) {
      this.feature = this.features[0].properties;

      this.hasUpstreamDownstream = this.chartService.parseData(this.feature.id);
    }
  }

  ngOnDestroy() {
    this.features = null;
    this.feature = null;
  }
}

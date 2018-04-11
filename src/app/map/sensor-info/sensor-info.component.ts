import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { ChartService } from '../../services/chart.service';
import { SensorInterface } from '../../interfaces';

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrls: ['./sensor-info.component.scss']
})
export class SensorInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() features: {
    [name: string]: any
  }[];

  feature: SensorInterface;
  hasUpstreamDownstream: boolean | null;

  constructor(
    private chartService: ChartService
  ) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('features')) {
      this.feature = this.features[0].properties;

      this.chartService.parseData(this.feature.id)
      .then(hasUpstreamDownstream => {
        this.hasUpstreamDownstream = hasUpstreamDownstream;

        this.chartService.drawSensorChart(document.getElementById('sensorChartWrapper'));
      })
      .catch(error => console.log(error));
    }
  }

  ngOnDestroy(): void {
    this.features = null;
    this.feature = null;
  }
}

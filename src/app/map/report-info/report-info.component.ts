import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { ReportInterface } from '../../interfaces';

@Component({
  selector: 'app-report-info',
  templateUrl: './report-info.component.html',
  styleUrls: ['./report-info.component.scss']
})
export class ReportInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() features: {
    [name: string]: any
  }[];

  feature: ReportInterface;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('features')) {
      // this.features[0].properties.report_data = JSON.parse(this.features[0].properties.report_data);
      // this.features[0].properties.tags = JSON.parse(this.features[0].properties.tags);

      this.feature = this.features[0].properties;
    }
  }

  ngOnDestroy() {
    this.features = null;
    this.feature = null;
  }
}

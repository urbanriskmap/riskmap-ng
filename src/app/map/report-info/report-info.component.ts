import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-report-info',
  templateUrl: './report-info.component.html',
  styleUrls: ['./report-info.component.scss']
})
export class ReportInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() features: {
    [name: string]: any
  }[];

  feature: {
    created_at: string,
    disaster_type: string,
    image_url: string,
    pkey: string,
    report_data: {
      flood_depth?: number,
      report_type: string
    } | null,
    source: string,
    status: string,
    tags: {
      district_id: string,
      local_area_id: string,
      instance_region_code: string
    },
    text: string,
    title: string,
    url: string
  };

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

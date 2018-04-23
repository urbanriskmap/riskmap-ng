import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { ReportInterface } from '../../interfaces';
import { TimeService } from '../../services/time.service';

@Component({
  selector: 'app-report-info',
  templateUrl: './report-info.component.html',
  styleUrls: ['./report-info.component.scss']
})
export class ReportInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() features: {
    [name: string]: any
  }[];

  @Output() closePane = new EventEmitter<null>();

  feature: ReportInterface;
  parsedReportData: {
    [name: string]: any
  };
  parsedTags: {
    [name: string]: any
  };
  timestamp: string;

  constructor(
    public timeService: TimeService
  ) {}

  ngOnInit(): void {
    this.timestamp = this.timeService.getLocalTime(this.feature.created_at, 'LT ll');
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('features')) {
      this.feature = this.features[0].properties;

      if (this.feature.report_data) {
        this.parsedReportData = JSON.parse(this.feature.report_data);
      }

      if (this.feature.tags) {
        this.parsedTags = JSON.parse(this.feature.tags);
      }
    }
  }

  ngOnDestroy(): void {
    this.features = null;
    this.feature = null;
  }
}

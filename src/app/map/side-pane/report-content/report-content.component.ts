import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SanitizePipe } from '../../../pipes/sanitize.pipe';
import { ReportContentInterface } from '../../../interfaces';
import reportContent from '../../../../resources/report-content';

@Component({
  selector: 'app-report-content',
  templateUrl: './report-content.component.html',
  styleUrls: ['./report-content.component.scss']
})
export class ReportContentComponent implements OnInit {
  content: ReportContentInterface[];

  constructor(
    public translate: TranslateService
  ) {
    this.content = reportContent.items;
  }

  ngOnInit() {
  }

}

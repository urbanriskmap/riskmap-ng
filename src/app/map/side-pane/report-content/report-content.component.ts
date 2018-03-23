import { Component, OnInit } from '@angular/core';

import reportContent from '../../../../resources/report-content';

@Component({
  selector: 'app-report-content',
  templateUrl: './report-content.component.html',
  styleUrls: ['./report-content.component.scss']
})
export class ReportContentComponent implements OnInit {
  content: {
    name: string,
    icons: string[],
    videoLink: string,
    steps: string[]
  }[];

  constructor() {
    this.content = reportContent.items;
  }

  ngOnInit() {
  }

}

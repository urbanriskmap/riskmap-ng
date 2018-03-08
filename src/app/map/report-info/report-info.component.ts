import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-report-info',
  templateUrl: './report-info.component.html',
  styleUrls: ['./report-info.component.scss']
})
export class ReportInfoComponent implements OnInit, OnChanges {
  @Input() features: object[];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('features')) {
      console.log(this.features);
    }
  }
}

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrls: ['./sensor-info.component.scss']
})
export class SensorInfoComponent implements OnInit, OnChanges {
  @Input() features: object[];

  constructor() { }

  ngOnInit() {
    // do
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('features')) {
      console.log(this.features);
    }
  }
}

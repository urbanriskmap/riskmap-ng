import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-area-info',
  templateUrl: './area-info.component.html',
  styleUrls: ['./area-info.component.scss']
})
export class AreaInfoComponent implements OnInit, OnChanges {
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

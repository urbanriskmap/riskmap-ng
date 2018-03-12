import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-area-info',
  templateUrl: './area-info.component.html',
  styleUrls: ['./area-info.component.scss']
})
export class AreaInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() features: {
    [name: string]: any
  }[];

  feature: {
    area_id: string,
    area_name: string,
    city_name: string,
    district_id: string,
    geom_id: string,
    last_updated: string,
    parent_name: string,
    state: number
  };

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('features')) {
      this.feature = this.features[0].properties;
    }
  }

  ngOnDestroy() {
    this.features = null;
    this.feature = null;
  }
}

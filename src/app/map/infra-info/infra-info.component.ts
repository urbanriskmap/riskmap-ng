import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-infra-info',
  templateUrl: './infra-info.component.html',
  styleUrls: ['./infra-info.component.scss']
})
export class InfraInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() features: {
    [name: string]: any
  }[];

  feature: {
    [name: string]: any
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

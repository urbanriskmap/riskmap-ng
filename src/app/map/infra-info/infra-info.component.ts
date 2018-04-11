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

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('features')) {
      this.feature = this.features[0].properties;
    }
  }

  ngOnDestroy(): void {
    this.features = null;
    this.feature = null;
  }
}

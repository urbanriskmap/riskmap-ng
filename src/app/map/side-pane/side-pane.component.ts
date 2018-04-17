import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-side-pane',
  templateUrl: './side-pane.component.html',
  styleUrls: ['./side-pane.component.scss']
})
export class SidePaneComponent implements OnInit {
  tabs = ['info', 'map', 'report'];
  selectedIndex: number;
  @Input() selectedTab: string;
  @Output() agreementPolicy = new EventEmitter<null>();

  constructor() { }

  ngOnInit() {
    this.selectedIndex = this.tabs.indexOf(this.selectedTab);
  }

  tabChanged(e) {
    this.selectedTab = this.tabs[e.index];
  }

  openAgreementPolicy() {
    this.agreementPolicy.emit(null);
  }
}

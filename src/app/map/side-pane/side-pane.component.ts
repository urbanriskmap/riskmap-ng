import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-pane',
  templateUrl: './side-pane.component.html',
  styleUrls: ['./side-pane.component.scss']
})
export class SidePaneComponent implements OnInit {
  tabs = ['info', 'map', 'report', 'settings'];
  selectedTab = 'info';

  constructor() { }

  ngOnInit() {
  }

  changeTab(tab) {
    this.selectedTab = tab;
  }
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-basin-info',
  templateUrl: './basin-info.component.html',
  styleUrls: ['./basin-info.component.scss']
})
export class BasinInfoComponent implements OnInit {
  @Input() sites: {
    [name: string]: any
  }[];

  constructor() { }

  ngOnInit() {
  }

}

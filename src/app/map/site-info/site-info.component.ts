import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-info',
  templateUrl: './site-info.component.html',
  styleUrls: ['./site-info.component.scss']
})
export class SiteInfoComponent implements OnInit {
  @Input() stations: {
    [name: string]: any
  }[];

  constructor() { }

  ngOnInit() {
  }

}

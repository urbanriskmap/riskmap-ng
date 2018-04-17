import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { Region } from '../../interfaces';

@Component({
  selector: 'app-region-picker',
  templateUrl: './region-picker.component.html',
  styleUrls: ['./region-picker.component.scss']
})
export class RegionPickerComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Region[]
  ) { }

  ngOnInit() {
  }

}

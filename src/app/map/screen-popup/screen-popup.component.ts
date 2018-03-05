import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './screen-popup.component.html',
  styleUrls: ['./screen-popup.component.scss']
})
export class ScreenPopupComponent {
  selectedRegion: {
    name: string,
    code: string,
    bounds: {
      sw: number[],
      ne: number[]
    }
  };

  constructor(
    // private dialogRef: MatDialogRef<ScreenPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
  }

}

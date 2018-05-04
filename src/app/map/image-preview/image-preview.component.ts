import { Component, OnInit, Input } from '@angular/core';
import { EXIF } from 'exif-js';

import { SanitizePipe } from '../../pipes/sanitize.pipe';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {
  @Input() imgUrl: string;

  // transformations = {
  //   1: '',
  //   2: 'rotateY(180deg)',
  //   3: 'rotate(180deg)',
  //   4: 'rotate(180deg) rotateY(180deg)',
  //   5: 'rotate(270deg) rotateY(180deg)',
  //   6: 'rotate(90deg)',
  //   7: 'rotate(90deg) rotateY(180deg)',
  //   8: 'rotate(270deg)'
  // };

  constructor() { }

  ngOnInit() {
  }

  getExif(): any {
    const img = document.getElementById('fullSizeImage');
    EXIF.getData(img, () => {
      console.log(EXIF.getAllTags(this));
    });
  }
}

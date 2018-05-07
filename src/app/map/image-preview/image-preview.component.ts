import { Component, OnInit, Input } from '@angular/core';
import { EXIF } from 'exif-js';

import { SanitizePipe } from '../../pipes/sanitize.pipe';
import { ReorientPipe } from '../../pipes/reorient.pipe';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {
  @Input() imgUrl: string;

  constructor() { }

  ngOnInit() {
  }
}

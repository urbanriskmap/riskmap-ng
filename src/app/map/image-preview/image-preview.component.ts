import { Component, Input } from '@angular/core';

import { SanitizePipe } from '../../pipes/sanitize.pipe';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent {
  @Input() imgUrl: string;

  constructor() { }

  preventClose(event) {
    event.stopPropagation();
  }
}

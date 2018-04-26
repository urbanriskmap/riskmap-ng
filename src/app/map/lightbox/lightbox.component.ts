import { Component, OnInit, Input } from '@angular/core';

import { SanitizePipe } from '../../pipes/sanitize.pipe';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent implements OnInit {
  @Input() imgUrl: string;

  constructor() { }
  ngOnInit() {
  }
}

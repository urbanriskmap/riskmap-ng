import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { InfoContentInterface } from '../../../interfaces';
import infoContent from '../../../../resources/info-content';

@Component({
  selector: 'app-info-content',
  templateUrl: './info-content.component.html',
  styleUrls: ['./info-content.component.scss']
})
export class InfoContentComponent implements OnInit {
  content: InfoContentInterface;
  @Output() agreementPolicy = new EventEmitter<null>();

  constructor() {
    this.content = infoContent;
  }

  ngOnInit() {
  }

  openAgreementPolicy() {
    this.agreementPolicy.emit(null);
  }

}

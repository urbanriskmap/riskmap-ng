import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-agreement-and-policy',
  templateUrl: './agreement-and-policy.component.html',
  styleUrls: ['./agreement-and-policy.component.scss']
})
export class AgreementAndPolicyComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: string | null
  ) {
    if (!this.data) {
      this.data = 'u_a';
    }
  }

  ngOnInit() {
  }

}

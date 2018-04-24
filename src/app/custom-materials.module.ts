import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatDialogModule,
  MatDialog,
  MatDialogRef,
  MatExpansionModule,
  MatGridListModule,
  MatListModule,
  MatRadioModule,
  MatSelectModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';


@NgModule({
  imports: [
  ],
  exports: [
    NoopAnimationsModule,
    FormsModule,
    CdkTableModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    MatToolbarModule
  ],
  providers: [
    MatDialog,
    // MatDialogRef
  ]
})
export class CustomMaterialsModule { }

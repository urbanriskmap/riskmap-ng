import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { ReportInfoComponent } from './report-info/report-info.component';
import { SensorInfoComponent } from './sensor-info/sensor-info.component';
import { AreaInfoComponent } from './area-info/area-info.component';
import { ScreenPopupComponent } from './screen-popup/screen-popup.component';
import { SidePaneComponent } from './side-pane/side-pane.component';
import { MapComponent } from './map.component';

import { CustomMaterialsModule } from '../custom-materials.module';

import { TimeService } from '../services/time.service';
import { LayerService } from '../services/layer.service';
import { HttpService } from '../services/http.service';

@NgModule({
  imports: [
    CommonModule,
    CustomMaterialsModule,
    RouterModule,
    TranslateModule
  ],
  providers: [
    TimeService,
    LayerService,
    HttpService,
    TranslatePipe
  ],
  entryComponents: [ScreenPopupComponent],
  declarations: [
    ReportInfoComponent,
    SensorInfoComponent,
    AreaInfoComponent,
    ScreenPopupComponent,
    SidePaneComponent,
    MapComponent
  ]
})
export class MapModule { }

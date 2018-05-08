import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Component } from '@angular/core';

// Components
import { MapComponent } from './map.component';
import { AreaInfoComponent } from './area-info/area-info.component';
import { InfraInfoComponent } from './infra-info/infra-info.component';
import { ReportInfoComponent } from './report-info/report-info.component';
import { SensorInfoComponent } from './sensor-info/sensor-info.component';
import { SidePaneComponent } from './side-pane/side-pane.component';
import { ReportContentComponent } from './side-pane/report-content/report-content.component';
import { MapContentComponent } from './side-pane/map-content/map-content.component';
import { InfoContentComponent } from './side-pane/info-content/info-content.component';
import { RegionPickerComponent } from './region-picker/region-picker.component';
import { AgreementAndPolicyComponent } from './agreement-and-policy/agreement-and-policy.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { NgVoteModule } from 'ng-vote';

// Modules
import { CustomMaterialsModule } from '../custom-materials.module';

// Services
import { ChartService } from '../services/chart.service';
import { HttpService } from '../services/http.service';
import { InteractionService } from '../services/interaction.service';
import { LayerService } from '../services/layer.service';
import { NotificationService } from '../services/notification.service';
import { SensorService } from '../services/sensor.service';
import { TimeService } from '../services/time.service';

// Pipes
import { SanitizePipe } from '../pipes/sanitize.pipe';
import { ReorientPipe } from '../pipes/reorient.pipe';

@NgModule({
  imports: [
    CommonModule,
    CustomMaterialsModule,
    RouterModule,
    TranslateModule,
    NgVoteModule
  ],
  providers: [
    TimeService,
    LayerService,
    HttpService,
    TranslatePipe,
    SensorService,
    InteractionService,
    ChartService,
    NotificationService
  ],
  entryComponents: [
    RegionPickerComponent,
    AgreementAndPolicyComponent
  ],
  declarations: [
    RegionPickerComponent,
    AgreementAndPolicyComponent,
    ReportInfoComponent,
    SensorInfoComponent,
    AreaInfoComponent,
    SidePaneComponent,
    MapComponent,
    InfraInfoComponent,
    ReportContentComponent,
    MapContentComponent,
    InfoContentComponent,
    SanitizePipe,
    ImagePreviewComponent,
    ReorientPipe
  ]
})
export class MapModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CustomMaterialsModule } from './custom-materials.module';
import { ReportInfoComponent } from './report-info/report-info.component';
import { SensorInfoComponent } from './sensor-info/sensor-info.component';
import { AreaInfoComponent } from './area-info/area-info.component';
import { ScreenPopupComponent } from './screen-popup/screen-popup.component';
import { SidePaneComponent } from './side-pane/side-pane.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ReportInfoComponent,
    SensorInfoComponent,
    AreaInfoComponent,
    ScreenPopupComponent,
    SidePaneComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CustomMaterialsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [ScreenPopupComponent],
  providers: [TranslatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

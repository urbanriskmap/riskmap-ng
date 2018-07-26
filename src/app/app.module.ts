import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ServiceWorkerModule } from '@angular/service-worker';

// Components
import { AppComponent } from './app.component';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { MapModule } from './map/map.module';
import { CustomMaterialsModule } from './custom-materials.module';

import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { RegisterComponent } from './register/register.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/locales/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CustomMaterialsModule,
    HttpClientModule,
    MapModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : []
  ],
  providers: [TranslatePipe, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

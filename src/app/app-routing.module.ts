import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';

// Ref for force reload
// https://medium.com/engineering-on-the-incline/reloading-current-route-on-click-angular-5-1a1bfc740ab2
const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: ':region', component: MapComponent, runGuardsAndResolvers: 'paramsChange' },
  { path: '**', redirectTo: '/pick-region' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload', enableTracing: false}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

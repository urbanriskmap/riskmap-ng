import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';

// Ref for force reload
// https://medium.com/engineering-on-the-incline/reloading-current-route-on-click-angular-5-1a1bfc740ab2
const routes: Routes = [
  // IDEA: Switch to single page navigation?
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: ':region', component: MapComponent, runGuardsAndResolvers: 'paramsChange' },
  // { path: ':region', component: MapComponent },
  { path: '**', redirectTo: '/pick-region' }
];

@NgModule({
  // IDEA: Switch to single page navigation?
  imports: [ RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload', enableTracing: false}) ],
  // imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

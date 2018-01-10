import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  param1 = {title: 'RiskMap', env: environment.envName};
  param2 = {env: environment.envName};
  param3 = {r: 3, h: 6};
  languages = ['en', 'es'];

  constructor(private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');
  }

  changeLanguage(event) {
    const lang = event.srcElement.value;
    this.translate.use(lang);
  }
}

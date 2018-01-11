import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import mapboxgl from 'mapbox-gl';

import { environment as env } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  map: mapboxgl.Map;
  param1 = {title: 'RiskMap', env: env.envName};
  param2 = {env: env.envName};
  param3 = {r: 3, h: 6};
  languages = env.locales.supportedLanguages;

  // Use ngx-translate-messageformat-compiler for pluralization, etc

  constructor(private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(env.locales.defaultLanguage);
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(env.locales.defaultLanguage);
  }

  changeLanguage(event) {
    const lang = event.srcElement.value;
    this.translate.use(lang);
  }

  ngOnInit() {
    const self = this;
    mapboxgl.accessToken = env.map.accessToken;
    self.map = new mapboxgl.Map({
      attributionControl: false,
      container: 'mapWrapper',
      center: env.map.center,
      zoom: env.map.initZoom,
      style: env.map.baseMapStyle,
      hash: false,
      preserveDrawingBuffer: true
    });

    self.map.on('style.load', () => {
      // Do stuff
    });
  }
}

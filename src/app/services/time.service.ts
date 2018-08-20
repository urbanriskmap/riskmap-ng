import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone/builds/moment-timezone.min';

import momentLocales from '../../resources/moment-locales';
import { environment as env } from '../../environments/environment';

@Injectable()
export class TimeService {
  constructor() {
    if (env.locales.defaultLanguage !== 'en') {
      moment.locale(env.locales.defaultLanguage);
    }
    moment.tz.setDefault(env.locales.timezone);
  }

  getLocalTime(zulu: string, format?: string) {
    if (format) {
      return moment(zulu).format(format);
    } else {
      return moment(zulu);
    }
  }

  changeTimeLocale(locale: string): void {
    moment.locale(locale);
  }
}

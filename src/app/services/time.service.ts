import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

// IDEA Use gulp task to import locales as per deployment in one generated file,
// then import time-locales file here, change with language
// REVIEW utility of time/date locales ?

// default timezone locale is English (US)
import 'moment/locale/id'; // Indonesian
// import 'moment/locale/es'; // Spanish
// import 'moment/locale/bn'; // Bengali
// import 'moment/locale/hi'; // Hindi
// import 'moment/locale/mr'; // Marathi
// import 'moment/locale/ta'; // Tamil
// import 'moment/locale/kn'; // Kannada

import { environment as env } from '../../environments/environment';

@Injectable()
export class TimeService {

  constructor() {
    if (env.locales.defaultLanguage !== 'en') {
      moment.locale(env.locales.defaultLanguage);
    }
    moment.tz.setDefault(env.locales.timezone);
  }

  // TODO create method to change moment.locale on language change, if required

  getLocalTimestamp(zulu: string) {
    return moment(zulu).format('LT ll'); // Local hours:minutes date month, year
  }

}

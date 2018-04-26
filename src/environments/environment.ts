export const environment = {
  production: false,
  envName: 'dev-us',

  servers: {
    data: 'https://data-dev.riskmap.us/',
    sensors: 'https://sensors-dev.riskmap.us/',
    settings: {
      reportTimeperiod: 604800
    }
  },

  map: {
    accessToken: 'pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNqZnY2cGxndzN3M3AyeHMydGVyeHcyMWIifQ.D6K1H9c8CTnP6twGYdtDKA',
    center: [-80.199261, 26.138301],
    initZoom: 10,
    minZoom: 10,
    baseMapStyle: 'mapbox://styles/urbanriskmap/cjfvacwic1cfc2smiwbyfwcs4'
  },

  locales: {
    supportedLanguages: [
      {code: 'en', name: 'English'},
      {code: 'es', name: 'Spanish'}
    ],
    defaultLanguage: 'en',
    timezone: 'America/New_York'
  },

  networks: {
    contact_links: {
      flag_email: 'risk@mit.edu'
    },
    socialButtons: [
      // Name string should match fontello icons name
      {
        name: 'twitter',
        intent: 'https://twitter.com/intent/tweet?text=' + msgText + '%20' + reportUrl
      },
      {
        name: 'telegram',
        intent: 'https://telegram.me/share/url?url=' + reportUrl + ' &text= ' + msgText
      },
      {
        name: 'whatsapp',
        intent: 'https://api.whatsapp.com/send?text=' + msgText + '%20' + reportUrl
      },
      {
        name: 'facebook',
        intent: 'https://www.facebook.com/sharer/sharer.php?u=' + self.reportUrl
      }
    ],

    deep_links: [
      { name: 'facebook',
        link: 'http://m.me/1747847428843379' // FB page id is used as no username is allowd at this point.
      },
      // TODO after the twitter dev bot is registered
      { name: 'twitter',
        link: 'https://twitter.com/messages/compose?recipient_id=905602080252977152&welcome_message_id=905919155492331523&text=/flood'
      }
      // Disable telegram button for US deployment
      // {name: 'telegram', link: 'https://telegram.me/CognicityUS_bot'}
    ]
  }
};

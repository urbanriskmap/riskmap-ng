export const environment = {
  production: false,
  envName: 'dev-id',
  deploymentName: 'id',

  servers: {
    data: 'https://data-dev.petabencana.id/',
    sensors: 'https://data.petabencana.id/',
    web_app: 'https://dev.petabencana.id/',
    settings: {
      reportTimeperiod: 604800
    }
  },

  map: {
    accessToken: 'pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNqZnY2cGxndzN3M3AyeHMydGVyeHcyMWIifQ.D6K1H9c8CTnP6twGYdtDKA',
    center: [106.8271, -6.1754],
    initZoom: 8,
    minZoom: 10,
    baseMapStyle: 'mapbox://styles/urbanriskmap/cjfvacwic1cfc2smiwbyfwcs4'
  },

  locales: {
    supportedLanguages: [
      {code: 'en', name: 'English'},
      {code: 'id', name: 'Bahasa'}
    ],
    defaultLanguage: 'en',
    timezone: 'Asia/Jakarta'
  },

  networks: {
    contact_links: {
      flag_email: 'info@petabencana.id'
    },
    deep_links: [
      { name: 'facebook',
        link: 'http://m.me/CognicityDev.id'
      },
      { name: 'twitter',
        link: 'https://twitter.com/intent/tweet?text=Laporkan+banjir&via=petabencana'
      },
      { name: 'telegram',
        link: 'https://telegram.me/CognicityDevBot'
      }
    ]
  }
};

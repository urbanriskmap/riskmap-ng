export const environment = {
  production: false,
  envName: 'dev-in',

  servers: {
    data: 'https://data-dev.riskmap.in/',
    sensors: 'https://sensors-dev.riskmap.in/',
    web_app: 'https://dev.riskmap.in/',
    settings: {
      reportTimeperiod: 604800
    }
  },

  map: {
    accessToken: 'pk.eyJ1IjoiYXNiYXJ2ZSIsImEiOiI4c2ZpNzhVIn0.A1lSinnWsqr7oCUo0UMT7w',
    center: [-80.199261, 26.138301],
    initZoom: 10,
    minZoom: 10,
    baseMapStyle: 'mapbox://styles/mapbox/light-v9'
  },

  locales: {
    supportedLanguages: [
      {code: 'en', name: 'English'},
      {code: 'hi', name: 'Hindi'},
      {code: 'ta', name: 'Tamil'},
      {code: 'mr', name: 'Marathi'},
      {code: 'kn', name: 'Kannada'},
      {code: 'bn', name: 'Bengali'}
    ],
    defaultLanguage: 'en',
    timezone: 'Asia/Kolkata'
  },

  networks: {
    contact_links: {
      flag_email: 'risk@mit.edu'
    },
    deep_links: [
        {name: 'facebook', link: 'http://m.me/CognicityDevIndia'},
        {name: 'twitter', link: 'https://twitter.com/intent/tweet?text=Report+flood&via=CognicityDev_IN'},
        {name: 'telegram', link: 'https://telegram.me/CognicityIN_bot'}
      ]
  }
};

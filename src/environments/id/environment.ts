export const environment = {
  production: false,
  envName: 'dev-id',

  servers: {
    data: 'https://data-dev.petabencana.id/',
    sensors: 'https://sensors-dev.petabencana.id/',
    settings: {
      reportTimeperiod: 604800
    }
  },

  map: {
    accessToken: 'pk.eyJ1IjoiYXNiYXJ2ZSIsImEiOiI4c2ZpNzhVIn0.A1lSinnWsqr7oCUo0UMT7w',
    center: [106.8271, -6.1754],
    initZoom: 10,
    minZoom: 8,
    baseMapStyle: 'mapbox://styles/asbarve/cj5sl6sg23qc12slb9zmg20kk'
  },

  locales: {
    supportedLanguages: [
      {code: 'en', name: 'English'},
      {code: 'id', name: 'Bahasa'}
    ],
    defaultLanguage: 'en',
    timezone: 'Asia/Jakarta'
  }
};

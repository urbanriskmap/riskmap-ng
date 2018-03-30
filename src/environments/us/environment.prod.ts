export const environment = {
  production: true,
  envName: 'prod-us',

  servers: {
    data: 'https://data.riskmap.us/',
    sensors: 'https://sensors.riskmap.us/',
    settings: {
      reportTimeperiod: 43200
    }
  },

  map: {
    accessToken: 'pk.eyJ1IjoiYXNiYXJ2ZSIsImEiOiI4c2ZpNzhVIn0.A1lSinnWsqr7oCUo0UMT7w',
    center: [-80.199261, 26.138301],
    initZoom: 10,
    minZoom: 10,
    baseMapStyle: 'mapbox://styles/urbanriskmap/ciwce3tim00532pocrokb7ojf'
  },

  locales: {
    supportedLanguages: [
      {code: 'en', name: 'English'},
      {code: 'es', name: 'Spanish'}
    ],
    defaultLanguage: 'en',
    timezone: 'America/New_York'
  }
};

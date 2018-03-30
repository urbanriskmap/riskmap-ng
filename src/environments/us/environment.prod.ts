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
    accessToken: 'pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNpdmVhbTFraDAwNHIyeWw1ZDB6Y2hhbTYifQ.tpgt1PB5lkJ-wITS02c96Q',
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

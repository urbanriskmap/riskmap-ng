// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  envName: 'dev-in',

  servers: {
    data: 'https://data-dev.riskmap.in/',
    sensors: 'https://sensors-dev.riskmap.in/',
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
      {code: 'ta', name: 'Tamil'}
    ],
    defaultLanguage: 'en'
  },

  instances: {
    instanceType: 'County', // city / county / etc
    regions: [
      {
        name: 'broward',
        code: 'brw',
        bounds: {
          sw: [25.35, -81.73],
          ne: [26.95, -78.45]
        }
      }
    ]
  },

  supportedLayers: [
    {name: 'reports',   present: true,    server: 'data',     useRegionFlag: true,  responseType: 'topojson'},
    {name: 'areas',     present: false,   server: 'data',     useRegionFlag: true,  responseType: 'topojson'},
    {name: 'sensors',   present: true,    server: 'sensors',  useRegionFlag: false, responseType: 'geojson'}
  ]
};

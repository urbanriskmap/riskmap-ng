// Default env for local development
// Served with 'ng s'

// For others, use 'ng s --e=dev-us'

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
    accessToken: 'pk.eyJ1IjoiYXNiYXJ2ZSIsImEiOiI4c2ZpNzhVIn0.A1lSinnWsqr7oCUo0UMT7w',
    center: [-80.199261, 26.138301],
    initZoom: 10,
    minZoom: 10,
    baseMapStyle: 'mapbox://styles/mapbox/light-v9'
  },

  locales: {
    supportedLanguages: [
      {code: 'en', name: 'English'},
      {code: 'es', name: 'Spanish'}
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
          sw: [-81.73, 25.35],
          ne: [-78.45, 26.95]
        }
      }
    ]
  },
  supportedLayers: [
    {
      metadata: {
        name: 'reports',
        server: 'data',
        useRegionFlag: true,
        responseType: 'topojson',
        uniqueKey: 'pkey',
        selected: {
          type: 'paint',
          style: {
            'circle-color': '#000000',
            'circle-radius': 8
          }
        }
      },
      settings: {
        id: 'reports',
        type: 'circle',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        paint: {
          'circle-color': '#31aade',
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff'
        }
      }
    },
    {
      metadata: {
        name: 'sensors',
        server: 'sensors',
        useRegionFlag: false,
        responseType: 'geojson',
        uniqueKey: 'uid',
        selected: {
          type: 'paint',
          style: {
            'circle-color': '#000000',
            'circle-radius': 5
          }
        }
      },
      settings: {
        id: 'sensors',
        type: 'circle',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        paint: {
          'circle-color': [
            'match',
            ['get', 'type'],
            'GW', '#ff0000',
            'ST', '#00ff00',
            'ST-CA', '#0000ff',
            '#ccc'
          ],
          'circle-radius': 5,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ddd'
        },
        filter: ['has', 'observations']
      }
    }
  ]
};

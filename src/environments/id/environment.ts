// Default env for local development
// Served with 'ng s'

// For others, use 'ng s --e=dev-us'

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
    baseMapStyle: 'mapbox://styles/mapbox/light-v9'
  },

  locales: {
    supportedLanguages: [
      {code: 'en', name: 'English'},
      {code: 'id', name: 'Bahasa'}
    ],
    defaultLanguage: 'en'
  },

  instances: {
    instanceType: 'City', // city / county / etc
    regions: [
      {
        name: 'jakarta',
        code: 'jbd',
        bounds: {
          sw: [106.480, -6.733],
          ne: [107.175, -5.880]
        }
      },
      {
        name: 'surabaya',
        code: 'sby',
        bounds: {
          sw: [25.35, -81.73],
          ne: [26.95, -78.45]
        }
      },
      {
        name: 'bandung',
        code: 'bdg',
        bounds: {
          sw: [25.35, -81.73],
          ne: [26.95, -78.45]
        }
      },
      {
        name: 'semarang',
        code: 'srg',
        bounds: {
          sw: [25.35, -81.73],
          ne: [26.95, -78.45]
        }
      }
    ]
  },
  supportedLayers: [
    {
      metadata: {
        name: 'floods',
        server: 'data',
        useRegionFlag: true,
        responseType: 'topojson',
        uniqueKey: 'area_id',
        selected: {
          type: 'paint',
          style: {
            'fill-color': [
              'match',
              ['get', 'state'],
              1, '#a0a9f7',
              2, '#ffff00',
              3, '#ff8300',
              4, '#cc2a41',
              '#fff'
            ],
            'fill-opacity': 0.75,
            'fill-outline-color': '#000'
          }
        }
      },
      settings: {
        id: 'floods',
        type: 'fill',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        paint: {
          'fill-color': [
            'match',
            ['get', 'state'],
            1, '#a0a9f7',
            2, '#ffff00',
            3, '#ff8300',
            4, '#cc2a41',
            '#ffffff'
          ],
          'fill-opacity': 0.6
        },
        filter: ['!=', ['get', 'state'], 'null']
      }
    },
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
    }
  ]
};

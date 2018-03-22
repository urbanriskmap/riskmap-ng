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
    accessToken: 'pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNpdmVhbTFraDAwNHIyeWw1ZDB6Y2hhbTYifQ.tpgt1PB5lkJ-wITS02c96Q',
    center: [106.8271, -6.1754],
    initZoom: 10,
    minZoom: 8,
    baseMapStyle: 'mapbox://styles/urbanriskmap/ciwce3tim00532pocrokb7ojf'
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
          sw: [112.397, -7.550],
          ne: [113.032, -7.014]
        }
      },
      {
        name: 'bandung',
        code: 'bdg',
        bounds: {
          sw: [107.369, -7.165],
          ne: [107.931, -6.668]
        }
      },
      {
        name: 'semarang',
        code: 'srg',
        bounds: {
          sw: [110.057, -7.335],
          ne: [110.715, -6.727]
        }
      }
    ]
  },

  supportedLayers: [
    {
      metadata: {
        name: 'floods',
        server: 'data',
        flags: {region: true},
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
              '#000'
            ],
            'fill-opacity': 0.75,
            'fill-outline-color': '#000'
          }
        },
        placeBelow: 'place-village'
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
            '#000'
          ],
          'fill-opacity': 0.6
        },
        filter: ['all', ['>', 'state', 0], ['!=', 'area_id', '']]
      }
    },
    {
      metadata: {
        name: 'reports',
        server: 'data',
        flags: {region: true},
        responseType: 'topojson',
        uniqueKey: 'pkey',
        selected: {
          type: 'layout',
          style: {
            'icon-image': 'reports_selected',
            'icon-size': 0.6,
            'icon-allow-overlap': true
          }
        }
      },
      settings: {
        id: 'reports',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        layout: {
          'icon-image': 'flood_reports',
          'icon-size': 0.2,
          'icon-allow-overlap': true
        },
        filter: ['all', ['!=', 'pkey', '']]
      }
    },
    {
      metadata: {
        name: 'pumps',
        server: 'data',
        path: 'infrastructure/',
        flags: {region: true},
        responseType: 'topojson',
        uniqueKey: 'name',
        selected: {
          type: 'paint',
          style: {
            'circle-color': '#000',
            'circle-radius': 8
          }
        }
      },
      settings: {
        id: 'pumps',
        type: 'circle',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        paint: {
          'circle-color': '#c26f00',
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        },
        filter: ['all', ['!=', 'name', '']]
      }
    }
  ]
};

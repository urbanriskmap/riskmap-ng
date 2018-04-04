export default {
  supported: [
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
            'icon-image': 'us_floodIcon_sel',
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
          'icon-image': 'us_floodIcon',
          'icon-allow-overlap': true
        },
        filter: ['all', ['!=', 'pkey', '']]
      }
    },
    {
      metadata: {
        name: 'sensors',
        server: 'sensors',
        flags: {region: false},
        responseType: 'geojson',
        uniqueKey: 'uid',
        // REVIEW: selection layer properties
        // If layout property remains same, and only icon-opacity in paint changes
        // without repeating all layout properties in selected: {}
        // i.e. selected: {} only contains styles that either override or modify
        // properties of base layer
        selected: {
          type: 'layout',
          style: {
            'icon-image': [
              'match',
              ['get', 'class'],
              '63160', 'us_gauge',
              '00065', 'us_elevation',
              '62610', 'us_well',
              '00060', 'us_discharge',
              '00045', 'us_precipitation',
              'us_pump'
            ],
            'icon-offset': [
              'match',
              ['get', 'class'],
              '63160', ['literal', [0, -30]],
              '00065', ['literal', [0, 0]],
              '62610', ['literal', [0, 0]],
              '00060', ['literal', [0, 30]],
              '00045', ['literal', [0, -30]],
              ['literal', [0, 0]]
            ],
            'icon-allow-overlap': true
          }
        }
      },
      settings: {
        id: 'sensors',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        paint: {
          'icon-opacity': 0.75
        },
        layout: {
          'icon-image': [
            'match',
            ['get', 'class'],
            '63160', 'us_gauge',
            '00065', 'us_elevation',
            '62610', 'us_well',
            '00060', 'us_discharge',
            '00045', 'us_precipitation',
            'us_pump'
          ],
          // For multiple sensors at same location
          'icon-offset': [
            'match',
            ['get', 'class'],
            '63160', ['literal', [0, -30]],
            '00065', ['literal', [0, 0]],
            '62610', ['literal', [0, 0]],
            '00060', ['literal', [0, 30]],
            '00045', ['literal', [0, -30]],
            ['literal', [0, 0]]
          ],
          'icon-allow-overlap': true
        },
        filter: ['all', ['has', 'observations'], ['!=', 'uid', '']]
      }
    }
  ]
};

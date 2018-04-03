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
            'icon-image': 'us_floodIcon_sel'
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
        layout: {
          'icon-image': 'us_floodIcon',
          'icon-size': 1,
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
        selected: {
          type: 'layout',
          style: {
            'icon-image': [
              'match',
              ['get', 'class'],
              '63160', 'us_gauge',
              '00065', 'us_elevation',
              '62610', 'us_groundwater',
              '00060', 'us_discharge',
              '00045', 'us_pump',
              'us_pump'
            ]
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
        layout: {
          'icon-image': [
            'match',
            ['get', 'class'],
            '63160', 'us_gauge',
            '00065', 'us_elevation',
            '62610', 'us_groundwater',
            '00060', 'us_discharge',
            '00045', 'us_pump',
            'us_pump'
          ],
          'icon-size': 1,
          'icon-allow-overlap': true
        },
        filter: ['all', ['has', 'observations'], ['!=', 'uid', '']]
      }
    }
  ]
};

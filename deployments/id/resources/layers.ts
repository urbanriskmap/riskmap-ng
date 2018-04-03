export default {
  supported: [
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
            'icon-image': 'us_floodIcon_sel'
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
          'icon-size': 1,
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
          type: 'layout',
          style: {
            'icon-image': 'us_pump'
          }
        }
      },
      settings: {
        id: 'pumps',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        layout: {
          'icon-image': 'us_pump',
          'icon-size': 1,
          'icon-allow-overlap': true
        },
        filter: ['all', ['!=', 'name', '']]
      }
    }
  ]
};

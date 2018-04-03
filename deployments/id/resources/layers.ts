export default {
  icons: [
    {
      name: 'floodIcon',
      path: 'assets/icons/id_floodIcon.svg',
    },
    {
      name: 'floodIconSelected',
      path: 'assets/icons/id_floodIcon-selected.svg',
    },
    {
      name: 'pumpIcon',
      path: 'assets/icons/id_pumpRTS.svg',
    },
  ],
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
            'icon-image': 'floodIconSelected',
            'icon-size': 0.5,
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
          'icon-image': 'floodIcon',
          'icon-size': 0.5,
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
            'icon-image': 'pumpIcon'
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
          'icon-image': 'pumpIcon',
          'icon-size': 0.5,
          'icon-allow-overlap': true
        },
        filter: ['all', ['!=', 'name', '']]
      }
    }
  ]
};

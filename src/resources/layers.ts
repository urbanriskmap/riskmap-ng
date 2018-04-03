export default {
  icons: [
    {
      name: 'floodIcon',
      path: 'assets/icons/us_floodIcon.svg'
    },
    {
      name: 'floodIconSelected',
      path: 'assets/icons/us_floodIcon-selected.svg'
    },
    {
      name: 'gauge1',
      path: 'assets/icons/us_gaugeRTS-1.svg'
    },
    {
      name: 'gauge2',
      path: 'assets/icons/us_gaugeRTS-2.svg'
    }
  ],
  supported: [
    {
      metadata: {
        name: 'reports',
        server: 'data',
        flags: {region: true},
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
        },
        filter: ['all', ['!=', 'pkey', '']]
      }
    },
    // {
    //   metadata: {
    //     name: 'sensors',
    //     server: 'sensors',
    //     flags: {region: false},
    //     responseType: 'geojson',
    //     uniqueKey: 'uid',
    //     selected: {
    //       type: 'paint',
    //       style: {
    //         'circle-color': '#000000',
    //         'circle-radius': 5
    //       }
    //     }
    //   },
    //   settings: {
    //     id: 'sensors',
    //     type: 'circle',
    //     source: {
    //       type: 'geojson',
    //       data: <object|null>null
    //     },
    //     paint: {
    //       'circle-color': [
    //         'match',
    //         ['get', 'class'],
    //         '63160', '#00ff00',
    //         '00065', '#0000ff',
    //         '62610', '#ff0000',
    //         '00060', '#ffcc00',
    //         '00045', '#00ccff',
    //         '#ccc'
    //       ],
    //       'circle-radius': 5,
    //       'circle-stroke-width': 1,
    //       'circle-stroke-color': '#ddd'
    //     },
    //     filter: ['all', ['has', 'observations'], ['!=', 'uid', '']]
    //   }
    // }
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
            'icon-size': 2
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
            '63160', 'us_floodIcon-selected', // 'gauge1',
            '00065', 'us_treeIcon-selected', // 'gauge2',
            '62610', 'us_powerIcon-selected', // 'gauge1',
            '00060', 'us_damageIcon-selected', // 'gauge2',
            '00045', 'us_blockIcon-selected', // 'gauge1',
            'us_blockIcon-selected' // 'gauge2'
          ],
          'icon-size': 1,
          'icon-allow-overlap': true
        },
        filter: ['all', ['has', 'observations'], ['!=', 'uid', '']]
      }
    }
  ]
};

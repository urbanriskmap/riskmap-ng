export default {
  supported: [
    {
      metadata: {
        name: 'floods',
        server: 'data',
        path: '',
        flags: [{region: true}],
        responseType: 'topojson',
        uniqueKey: 'area_id',
        selected: {
          type: 'paint',
          styles: {
            'fill-opacity': 0.8,
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
        path: '',
        flags: [{region: true}],
        responseType: 'topojson',
        uniqueKey: 'pkey',
        selected: {
          type: 'layout',
          styles: {
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
          'icon-allow-overlap': true,
          'icon-ignore-placement': false,
          'icon-size': [
            'interpolate', ['linear'], ['zoom'],
            12, 0.75,
            16, 1
          ]
        },
        filter: ['all', ['!=', 'pkey', '']]
      }
    },
    {
      metadata: {
        // IDEA: View-only layers
        // have 'viewOnly: boolean' key,
        // for layers with metadata only (eg. name)
        // and no realtime stream.
        // Such layers do not trigger info panes to open
        name: 'pumps',
        server: 'data',
        path: 'infrastructure/',
        flags: [{region: true}],
        responseType: 'topojson',
        uniqueKey: 'name',
        selected: {
          type: 'layout',
          styles: { }
        },
        placeBelow: 'place-village'
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
          'icon-allow-overlap': false,
          'icon-size': [
            'interpolate', ['linear'], ['zoom'],
            12, 0.75,
            16, 1
          ]
          // IDEA: NOT YET SUPPORTED
          // 'visibility': [
          //   'step',
          //   ['zoom'],
          //   1, 'none',
          //   16, 'visible'
          // ]
        },
        filter: ['all', ['!=', 'name', '']]
      }
    },
    {
      metadata: {
        name: 'floodgauges',
        server: 'sensors',
        path: '',
        flags: [{region: true}],
        responseType: 'topojson',
        uniqueKey: 'gaugeid',
        selected: {
          type: 'layout',
          styles: {
            'icon-image': 'us_gauge'
          }
        },
      },
      settings: {
        id: 'floodgauges',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        layout: {
          'icon-image': [
            'match',
            ['to-number', // convert to number
              ['get', 'f3', // lookup (key=f3) of:
                ['object',
                  ['at', // lookup (index=length of array - 1): i.e. last observation
                    ['-', ['length', ['array', ['get', 'observations']]], 1],
                      ['array', ['get', 'observations']]]]]], // parse observations property (json) into array
            1, 'id_gauge_1',
            2, 'id_gauge_2',
            3, 'id_gauge_3',
            4, 'id_gauge_4',
            'id_gauge_1'
          ],
          'icon-allow-overlap': true,
          'icon-size': [
            'interpolate', ['linear'], ['zoom'],
            12, 0.75,
            16, 1
          ]
        },
        filter: ['all', ['!=', 'gaugeid', '']]
      }
    }
  ]
};

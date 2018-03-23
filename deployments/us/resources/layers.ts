export default {
  layers: [
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
    {
      metadata: {
        name: 'sensors',
        server: 'sensors',
        flags: {region: false},
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
            ['get', 'class'],
            '63160', '#00ff00',
            '00065', '#0000ff',
            '62610', '#ff0000',
            '00060', '#ffcc00',
            '00045', '#00ccff',
            '#ccc'
          ],
          'circle-radius': 5,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ddd'
        },
        filter: ['all', ['has', 'observations'], ['!=', 'uid', '']]
      }
    }
  ]
};

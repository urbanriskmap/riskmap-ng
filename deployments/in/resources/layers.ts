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
            'icon-image': 'reports_selected',
            'icon-size': 0.075,
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
          'icon-size': 0.05,
          'icon-allow-overlap': true
        },
        filter: ['all', ['!=', 'pkey', '']]
      }
    }
  ]
};

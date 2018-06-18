export default {
  supported: [
    // Reports layer
    {
      metadata: {
        name: 'reports',
        server: 'data',
        path: 'reports/',
        flags: [{region: true}],
        responseType: 'topojson',
        uniqueKey: 'pkey',
        legendGroup: 'reports',
        selected: {
          type: 'layout',
          styles: {
            'icon-image': 'map_floodIcon_sel'
          }
        },
        viewOnly: false
      },
      settings: {
        id: 'reports',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        layout: {
          'icon-image': 'map_floodIcon',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-size': 0.75
        },
        filter: ['all', ['!=', 'pkey', '']]
      },
      legend: [
        {
          symbolType: 'icon',
          symbolStyle: 'icon-map-flood',
          label: 'legend.flood_report'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-map-tree',
          label: 'legend.tree',
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-map-block',
          label: 'legend.block',
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-map-damage',
          label: 'legend.damage',
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-map-power',
          label: 'legend.power',
        }
      ]
    }
  ]
};

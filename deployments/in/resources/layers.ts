export default {
  supported: [
    // Reports layer
    {
      metadata: {
        name: 'reports',
        server: 'data',
        path: 'reports/',
        publicAccess: true,
        flags: [{region: true}],
        responseType: 'topojson',
        uniqueKey: 'pkey',
        legendGroup: 'reports',
        selected: {
          type: 'layout',
          styles: {
            'icon-image': [
              'match',
              ['get', 'report_type', ['object', ['get', 'report_data']]],
              'drain', 'map_blockIcon_sel',
              'damage', 'map_damageIcon_sel',
              'power', 'map_powerIcon_sel',
              'treeclearing', 'map_treeIcon_sel',
              'flood', 'map_floodIcon_sel',
              'map_floodIcon_sel'
            ],
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
          'icon-image': [
            'match',
            ['get', 'report_type', ['object', ['get', 'report_data']]],
            'drain', 'map_blockIcon',
            'damage', 'map_damageIcon',
            'power', 'map_powerIcon',
            'treeclearing', 'map_treeIcon',
            'flood', 'map_floodIcon',
            'map_floodIcon'
          ],
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
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-map-assessment',
          label: 'legend.assessment',
        }
      ]
    }
  ]
};

export default {
  // "report_data": {
  //   "damages": [
  //     {
  //       "component": "plinth",
  //       "severity": 5
  //     },

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
              'assessment', 'map_assessment_sel',
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
            'assessment', [
              'match',
              // NOTE: will currently style icon based on severity of first damage in array
              // TODO: lookup all severity keys, get highest damage grade
              ['get', 'severity', [ // get severity key
                'object', ['at', 0, [ // of object which is at [0] in
                  'array', ['get', 'damages', [ // array called damages
                    'object', ['get', 'report_data'] // from object report_data, root level property
                  ]]
                ]]
              ]],
              1, 'map_assessment1',
              2, 'map_assessment2',
              3, 'map_assessment3',
              4, 'map_assessment4',
              5, 'map_assessment5',
              'map_assessment1' // Default when no damages reported
            ],
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
          symbolStyle: 'icon-map-treeclearing',
          label: 'legend.treeclearing',
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-map-drain',
          label: 'legend.drain',
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

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
              'treeclearing', 'map_treeclearingIcon_sel',
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
            'drain', 'map_drainIcon',
            'damage', 'map_damageIcon',
            'power', 'map_powerIcon',
            'treeclearing', 'map_treeclearingIcon',
            'flood', 'map_floodIcon',
            'assessment', ['match',
              ['max', // Return 'max' of the following numeric values
                // VALUE 1: damages array will always have atleast 1 item
                ['get', 'severity', [ // get severity key
                  'object', ['at', 0, [ // of object which is at index, in
                    'array', ['get', 'damages', [ // array called damages
                      'object', ['get', 'report_data'] // from object report_data, root level property
                    ]]
                  ]]
                ]],
                // VALUE 2:
                ['case',
                  // If
                  ['>', // Length of damages array is greater...
                    ['length', [
                      'array', ['get', 'damages', [
                        'object', ['get', 'report_data']
                      ]]
                    ]],
                    1 // ...than value
                  ],
                  // Then
                  ['get', 'severity', [ // get severity key
                    'object', ['at', 1, [ // of object which is at index, in
                      'array', ['get', 'damages', [ // array called damages
                        'object', ['get', 'report_data'] // from object report_data, root level property
                      ]]
                    ]]
                  ]],
                  // Else
                  1 // return value
                ],
                // VALUE 3:
                ['case',
                  // If
                  ['>', // Length of damages array is greater...
                    ['length', [
                      'array', ['get', 'damages', [
                        'object', ['get', 'report_data']
                      ]]
                    ]],
                    2 // ...than value
                  ],
                  // Then
                  ['get', 'severity', [ // get severity key
                    'object', ['at', 2, [ // of object which is at index, in
                      'array', ['get', 'damages', [ // array called damages
                        'object', ['get', 'report_data'] // from object report_data, root level property
                      ]]
                    ]]
                  ]],
                  // Else
                  1 // return value
                ],
                // VALUE 4:
                ['case',
                  // If
                  ['>', // Length of damages array is greater...
                    ['length', [
                      'array', ['get', 'damages', [
                        'object', ['get', 'report_data']
                      ]]
                    ]],
                    3 // ...than value
                  ],
                  // Then
                  ['get', 'severity', [ // get severity key
                    'object', ['at', 3, [ // of object which is at index, in
                      'array', ['get', 'damages', [ // array called damages
                        'object', ['get', 'report_data'] // from object report_data, root level property
                      ]]
                    ]]
                  ]],
                  // Else
                  1 // return value
                ],
              ],
              // Input from above expression, Output
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

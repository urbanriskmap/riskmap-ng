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
        }
      ]
    },

    // Sensors layer
    {
      metadata: {
        name: 'sensors_usgs',
        server: 'sensors',
        path: '',
        flags: [
          {region: false},
          {agency: 'usgs'}
        ],
        responseType: 'geojson',
        uniqueKey: 'id',
        legendGroup: 'infrastructure',
        selected: {
          type: 'layout',
          styles: {
            'icon-image': [
              'match',
              ['get', 'class'],
              '63160', 'map_gauge_sel',
              '00065', 'map_level_sel',
              '62610', 'map_well_sel',
              '00060', 'map_discharge_sel',
              '00045', 'map_precipitation_sel',
              'map_pump_sel'
            ]
          }
        },
        viewOnly: false
      },
      settings: {
        id: 'sensors_usgs',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        paint: {
          'icon-opacity': 1
        },
        layout: {
          'icon-image': [
            'match',
            ['get', 'class'],
            '63160', 'map_gauge',
            '00065', 'map_level',
            '62610', 'map_well',
            '00060', 'map_discharge',
            '00045', 'map_precipitation',
            'map_pump'
          ],
          'icon-offset': [ // For multiple sensors at same location
            'match',
            ['get', 'class'],
            '63160', ['literal', [35, 0]],
            '00065', ['literal', [0, 0]],
            '62610', ['literal', [0, 0]],
            '00060', ['literal', [35, 0]],
            '00045', ['literal', [-35, 0]],
            ['literal', [0, 0]]
          ],
          'icon-size': .75,
          'icon-allow-overlap': true
        },
        filter: ['all', ['has', 'observations'], ['!=', 'id', '']]
      },
      legend: [
        {
          symbolType: 'icon',
          symbolStyle: 'icon-gauge',
          label: 'legend.gauge',
          source: 'USGS'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-level',
          label: 'legend.elevation',
          source: 'USGS'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-well',
          label: 'legend.well',
          source: 'USGS'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-discharge',
          label: 'legend.discharge',
          source: 'USGS'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-precipitation',
          label: 'legend.precipitation',
          source: 'USGS'
        }
      ]
    }
  ]
};

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

    // Sites SFWMD
    {
      metadata: {
        name: 'sites',
        server: 'data',
        path: 'infrastructure/sites',
        publicAccess: false,
        flags: [],
        responseType: 'topojson',
        uniqueKey: 'name',
        legendGroup: 'infrastructure',
        selected: {
          type: 'layout',
          styles: {
            'icon-image': 'map_site_sel'
          }
        },
        viewOnly: false
      },
      settings: {
        id: 'sites',
        maxzoom: 16,
        type: 'symbol',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        layout: {
          'icon-image': 'map_site',
          'icon-allow-overlap': true,
          'icon-size': 0.75
        },
        filter: ['all', ['!=', 'name', '']]
      },
      legend: [
        {
          symbolType: 'icon',
          symbolStyle: 'icon-site',
          label: 'legend.sfwmd.site',
          source: 'SFWMD'
        }
      ]
    },

    // Sensors layer (SFWMD)
    {
      metadata: {
        name: 'sensors_sfwmd',
        server: 'sensors',
        path: '',
        publicAccess: false,
        flags: [{agency: 'sfwmd'}],
        responseType: 'geojson',
        uniqueKey: 'id',
        legendGroup: 'infrastructure',
        selected: {
          type: 'layout',
          styles: {
            'icon-image': [
              'match',
              ['get', 'class'],
              'H', 'map_headwater_sel',
              'T', 'map_tailwater_sel',
              'S', 'map_spillway_sel',
              'C', 'map_discharge_sel',
              'P', 'map_pump_sel',
              'W', 'map_weir_sel',
              'O', 'map_spillway_sel',
              'map_gauge_sel'
            ]
          }
        },
        viewOnly: false
      },
      settings: {
        id: 'sensors_sfwmd',
        minzoom: 16,
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
            'H', 'map_headwater',
            'T', 'map_tailwater',
            'S', 'map_spillway',
            'C', 'map_discharge',
            'P', 'map_pump',
            'W', 'map_weir',
            'O', 'map_spillway',
            'map_gauge'
          ],
          'icon-size': .75,
          'icon-allow-overlap': false
        },
        filter: ['all', ['has', 'observations'], ['!=', 'id', '']]
      },
      legend: [
        {
          symbolType: 'icon',
          symbolStyle: 'icon-headwater',
          label: 'legend.sfwmd.headwater',
          source: 'SFWMD'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-tailwater',
          label: 'legend.sfwmd.tailwater',
          source: 'SFWMD'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-spillway',
          label: 'legend.sfwmd.spillway',
          source: 'SFWMD'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-discharge',
          label: 'legend.sfwmd.culvert',
          source: 'SFWMD'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-pump',
          label: 'legend.sfwmd.pump',
          source: 'SFWMD'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-weir',
          label: 'legend.sfwmd.weir',
          source: 'SFWMD'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-spillway',
          label: 'legend.sfwmd.channel',
          source: 'SFWMD'
        }
      ]
    },

    // Sensors layer (NOAA)
    {
      metadata: {
        name: 'sensors_noaa',
        server: 'sensors',
        path: '',
        publicAccess: false,
        flags: [{agency: 'noaa'}],
        responseType: 'geojson',
        uniqueKey: 'id',
        legendGroup: 'infrastructure',
        selected: {
          type: 'layout',
          styles: {
            'icon-image': 'map_tide_sel'
          }
        },
        viewOnly: false
      },
      settings: {
        id: 'sensors_noaa',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        layout: {
          'icon-image': 'map_tide',
          'icon-size': 0.75
        },
        filter: ['all', ['!=', 'id', '']]
      },
      legend: [
        {
          symbolType: 'icon',
          symbolStyle: 'icon-tide',
          label: 'legend.noaa.tide',
          source: 'NOAA'
        }
      ]
    },

    // Sensors layer (USGS)
    // {
    //   metadata: {
    //     name: 'sensors_usgs',
    //     server: 'sensors',
    //     path: '',
    //     publicAccess: false,
    //     flags: [{agency: 'usgs'}],
    //     responseType: 'geojson',
    //     uniqueKey: 'id',
    //     legendGroup: 'infrastructure',
    //     selected: {
    //       type: 'layout',
    //       styles: {
    //         'icon-image': [
    //           'match',
    //           ['get', 'class'],
    //           '63160', 'map_gauge_sel',
    //           '00065', 'map_level_sel',
    //           '62610', 'map_well_sel',
    //           '00060', 'map_discharge_sel',
    //           '00045', 'map_precipitation_sel',
    //           'map_pump_sel'
    //         ]
    //       }
    //     },
    //     viewOnly: false
    //   },
    //   settings: {
    //     id: 'sensors_usgs',
    //     type: 'symbol',
    //     source: {
    //       type: 'geojson',
    //       data: <object|null>null
    //     },
    //     paint: {
    //       'icon-opacity': 0.75
    //     },
    //     layout: {
    //       'icon-image': [
    //         'match',
    //         ['get', 'class'],
    //         '63160', 'map_gauge',
    //         '00065', 'map_level',
    //         '62610', 'map_well',
    //         '00060', 'map_discharge',
    //         '00045', 'map_precipitation',
    //         'map_pump'
    //       ],
    //       'icon-offset': [ // For multiple sensors at same location
    //         'match',
    //         ['get', 'class'],
    //         '63160', ['literal', [35, 0]],
    //         '00065', ['literal', [0, 0]],
    //         '62610', ['literal', [0, 0]],
    //         '00060', ['literal', [35, 0]],
    //         '00045', ['literal', [-35, 0]],
    //         ['literal', [0, 0]]
    //       ],
    //       'icon-size': .6,
    //       'icon-allow-overlap': true
    //     },
    //     filter: ['all', ['has', 'observations'], ['!=', 'id', '']]
    //   },
    //   legend: [
    //     {
    //       symbolType: 'icon',
    //       symbolStyle: 'icon-gauge',
    //       label: 'legend.usgs.gauge',
    //       source: 'USGS'
    //     },
    //     {
    //       symbolType: 'icon',
    //       symbolStyle: 'icon-level',
    //       label: 'legend.usgs.elevation',
    //       source: 'USGS'
    //     },
    //     {
    //       symbolType: 'icon',
    //       symbolStyle: 'icon-well',
    //       label: 'legend.usgs.well',
    //       source: 'USGS'
    //     },
    //     {
    //       symbolType: 'icon',
    //       symbolStyle: 'icon-discharge',
    //       label: 'legend.usgs.discharge',
    //       source: 'USGS'
    //     },
    //     {
    //       symbolType: 'icon',
    //       symbolStyle: 'icon-precipitation',
    //       label: 'legend.usgs.precipitation',
    //       source: 'USGS'
    //     }
    //   ]
    // },

    // Basins
    {
      metadata: {
        name: 'basins',
        server: 'data',
        path: 'infrastructure/basins',
        publicAccess: false,
        flags: [],
        responseType: 'topojson',
        uniqueKey: 'tags.basin_code',
        legendGroup: 'infrastructure',
        selected: {
          type: 'paint',
          styles: {
            'fill-opacity': 0.8,
            'fill-outline-color': '#0474cb'
          }
        },
        viewOnly: false,
        placeBelow: 'place-village'
      },
      settings: {
        id: 'basins',
        type: 'fill',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        paint: {
          'fill-color': '#fff',
          'fill-opacity': 0.4,
          'fill-outline-color': '#000'
        },
        filter: ['all', ['!=', ['get', 'basin_code', ['object', ['get', 'tags']]], '']]
      },
      legend: [
        {
          symbolType: 'fill',
          symbolStyle: 'assets/icons/webapp/apple-touch-icon-76x76.png',
          label: 'legend.sfwmd.basin'
        }
      ]
    },

    // Canals
    {
      metadata: {
        name: 'canals',
        server: 'data',
        path: 'infrastructure/waterways',
        publicAccess: false,
        flags: [],
        responseType: 'topojson',
        uniqueKey: 'tags.id',
        legendGroup: 'infrastructure',
        viewOnly: true,
        placeBelow: 'place-village'
      },
      settings: {
        id: 'canals',
        type: 'line',
        source: {
          type: 'geojson',
          data: <object|null>null
        },
        paint: {
          'line-color': '#0474cb', // mapbox water: #93c2eb
          'line-width': [
            "interpolate", ["linear"], ["zoom"],
            // zoom is 10 or less, width will be 1px
            10, 1,
            // zoom is 16 or more, width will be 8px
            16, 8,
          ],
          'line-opacity': [
            "interpolate", ["linear"], ["zoom"],
            // zoom is 12 or less, opacity will be 1
            12, 1,
            // zoom is 16 or more, opacity will be 0
            16, 0,
          ],
        },
        filter: ['all', ['!=', ['get', 'id', ['object', ['get', 'tags']]], '']]
      },
      legend: [
        // {
        //   symbolType: 'fill',
        //   symbolStyle: 'assets/icons/webapp/apple-touch-icon-76x76.png',
        //   label: 'legend.sfwmd.basin'
        // }
      ]
    }
  ]
};

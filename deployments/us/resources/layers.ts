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

    // Sensors layer (USGS)
    {
      metadata: {
        name: 'sensors_usgs',
        server: 'sensors',
        path: '',
        flags: [{agency: 'usgs'}],
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
          label: 'legend.usgs.gauge',
          source: 'USGS'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-level',
          label: 'legend.usgs.elevation',
          source: 'USGS'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-well',
          label: 'legend.usgs.well',
          source: 'USGS'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-discharge',
          label: 'legend.usgs.discharge',
          source: 'USGS'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-precipitation',
          label: 'legend.usgs.precipitation',
          source: 'USGS'
        }
      ]
    },

    // Sensors layer (SFWMD)
    {
      metadata: {
        name: 'sensors_sfwmd',
        server: 'sensors',
        path: '',
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
          label: 'legend.headwater',
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
        }
      ]
    },

    // Basins
    {
      metadata: {
        name: 'basins',
        server: 'data',
        path: 'infrastructure/basins',
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
          'fill-opacity': 0.25,
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

    // Sites SFWMD
    {
      metadata: {
        name: 'sites',
        server: 'data',
        path: 'infrastructure/sites',
        flags: [], // REVIEW region flag doesn't work, 3d infrastructure coordinates?
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
    }
  ]
};

export default {
  supported: [
    // Flood areas layer
    {
      metadata: {
        name: 'floods',
        server: 'data',
        path: 'floods/',
        flags: [{region: true}],
        responseType: 'topojson',
        uniqueKey: 'area_id',
        legendGroup: 'infrastructure',
        selected: {
          type: 'paint',
          styles: {
            'fill-opacity': 0.8,
            'fill-outline-color': '#000'
          }
        },
        viewOnly: false,
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
      },
      legend: [
        {
          symbolType: 'fill',
          symbolStyle: 'assets/icons/webapp/area_1.svg',
          label: 'legend_area_1'
        },
        {
          symbolType: 'fill',
          symbolStyle: 'assets/icons/webapp/area_2.svg',
          label: 'legend_area_2'
        },
        {
          symbolType: 'fill',
          symbolStyle: 'assets/icons/webapp/area_3.svg',
          label: 'legend_area_3'
        },
        {
          symbolType: 'fill',
          symbolStyle: 'assets/icons/webapp/area_4.svg',
          label: 'legend_area_4'
        }
      ]
    },

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
          'icon-ignore-placement': false,
          'icon-size': [
            'interpolate', ['linear'], ['zoom'],
            12, 0.75,
            16, 1
          ]
        },
        filter: ['all', ['!=', 'pkey', '']]
      },
      legend: [
        {
          symbolType: 'icon',
          symbolStyle: 'icon-map-flood',
          label: 'legend_flood_report'
        }
      ]
    },

    // Pumps layer
    {
      metadata: {
        name: 'pumps',
        server: 'sensors', // TEMP 
        path: 'infrastructure/pumps',
        flags: [{region: true}],
        responseType: 'topojson',
        uniqueKey: 'name',
        legendGroup: 'infrastructure',
        selected: {
          type: 'layout',
          styles: {
            'icon-image': 'map_pump_sel'
          }
        },
        viewOnly: true,
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
          'icon-image': 'map_pump',
          'icon-allow-overlap': false,
          'icon-size': [
            'interpolate', ['linear'], ['zoom'],
            12, 0.75,
            16, 1
          ]
        },
        filter: ['all', ['!=', 'name', '']]
      },
      legend: [
        {
          symbolType: 'icon',
          symbolStyle: 'icon-us-pump',
          label: 'legend_pump'
        }
      ]
    },

    // Flood gauges
    {
      metadata: {
        name: 'floodgauges',
        server: 'sensors',
        path: 'floodgauges/',
        flags: [{region: true}],
        responseType: 'topojson',
        uniqueKey: 'gaugeid',
        legendGroup: 'infrastructure',
        selected: {
          type: 'layout',
          styles: {
            'icon-image': 'map_gauge_sel'
          }
        },
        viewOnly: false
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
            1, 'map_gauge_1',
            2, 'map_gauge_2',
            3, 'map_gauge_3',
            4, 'map_gauge_4',
            'map_gauge'
          ],
          'icon-allow-overlap': true,
          'icon-size': [
            'interpolate', ['linear'], ['zoom'],
            12, 0.75,
            16, 1
          ]
        },
        filter: ['all', ['!=', 'gaugeid', '']]
      },
      legend: [
        {
          symbolType: 'icon',
          symbolStyle: 'icon-id-gauge-1',
          label: 'legend_gauge_1'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-id-gauge-2',
          label: 'legend_gauge_2'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-id-gauge-3',
          label: 'legend_gauge_3'
        },
        {
          symbolType: 'icon',
          symbolStyle: 'icon-id-gauge-4',
          label: 'legend_gauge_4'
        },
      ]
    }
  ]
};

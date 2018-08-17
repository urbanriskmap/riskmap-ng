export default {
  instanceType: 'City', // city / county / etc
  regions: [
  {
    name: 'kerala',
    code: 'krl',
    bounds: {
      sw: [74.6985, 8.1333],
      ne: [78.2170, 12.978]
    },
    initMapview: {
      center: [76.2673, 9.9312],
      zoom: 10
    }
  },
  {
      name: 'mumbai',
      code: 'mum',
      bounds: {
        sw: [72.704, 18.860],
        ne: [73.095, 19.297]
      },
      initMapview: {
        center: [72.8777, 19.0760],
        zoom: 10
      }
    },
    {
      name: 'bengaluru',
      code: 'blr',
      bounds: {
        sw: [77.365, 12.763],
        ne: [77.866, 13.200]
      },
      initMapview: {
        center: [77.5946, 12.9716],
        zoom: 12
      }
    },
    {
      name: 'chennai',
      code: 'chn',
      bounds: {
        sw: [79.925, 12.688],
        ne: [80.541, 13.377]
      },
      initMapview: {
        center: [80.2707, 13.0827],
        zoom: 12
      }
    },
    {
      name: 'madhubani',
      code: 'mdh',
      bounds: {
        sw: [85.7296, 26.0162],
        ne: [86.7495, 26.6864]
      },
      initMapview: {
        center: [86.0715, 26.3469],
        zoom: 13
      }
    }
  ]
};

export default {
  instanceType: 'City', // city / county / etc
  regions: [
    {
      name: 'mumbai',
      code: 'mum',
      bounds: {
        sw: [72.704, 18.860],
        ne: [73.095, 19.297]
      }
    },
    {
      name: 'bengaluru',
      code: 'bgl',
      bounds: {
        sw: [77.365, 12.763],
        ne: [77.866, 13.200]
      }
    },
    {
      name: 'chennai',
      code: 'chn',
      bounds: {
        sw: [79.925, 12.688],
        ne: [80.541, 13.377]
      }
    }
  ]
};

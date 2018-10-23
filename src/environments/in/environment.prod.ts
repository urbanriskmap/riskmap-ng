export const environment = {
  production: true,
  envName: 'prod-in',
  deploymentName: 'in',

  servers: {
    data: 'https://data.riskmap.in/',
    sensors: 'https://sensors.riskmap.in/',
    web_app: 'https://riskmap.in/',
    settings: {
      reportTimeperiod: 129600 // 36hrs
    }
  },

  authorization: {
    userPoolId: 'ap-south-1_yNLDVmvAW',
    appClientId: '7iu4qevi6rge61bsnaovckghup'
  },

  map: {
    accessToken: 'pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNqZnY2cGxndzN3M3AyeHMydGVyeHcyMWIifQ.D6K1H9c8CTnP6twGYdtDKA',
    center: [76.5, 19], // map initializes on india
    initZoom: 6,
    minZoom: 6,
    baseMapStyle: 'mapbox://styles/urbanriskmap/cjfvacwic1cfc2smiwbyfwcs4'
  },

  locales: {
    supportedLanguages: [
      {code: 'en', name: 'English'},
      {code: 'hi', name: 'Hindi'},
      {code: 'ta', name: 'Tamil'},
      {code: 'mr', name: 'Marathi'},
      {code: 'ml', name: 'Malayalam'}
    ],
    defaultLanguage: 'en',
    timezone: 'Asia/Kolkata'
  },

  networks: {
    contact_links: {
      flag_email: 'riskmap@mit.edu'
    },

    deep_links: [
      {
        name: 'facebook',
        link: 'http://m.me/riskmapbot'
      },
      {
        name: 'twitter',
        link: 'https://twitter.com/messages/compose?recipient_id=855444307670597632'
      },
      {
        name: 'telegram',
        link: 'https://telegram.me/riskmapbot'
      }
    ]
  }
};

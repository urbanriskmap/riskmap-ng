/*
  Copy of an env file from the deployment folders, i.e. environments/us/environment.ts etc.
  Required for local development server, during ng serve
*/

export const environment = {
  production: false,
  envName: 'dev-in',
  deploymentName: 'in',

  servers: {
    data: 'https://data-dev.riskmap.in/',
    sensors: 'https://sensors-dev.riskmap.in/',
    web_app: 'https://dev.riskmap.in/',
    settings: {
      reportTimeperiod: 604800
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
      {code: 'kn', name: 'Kannada'},
      {code: 'ml', name: 'Malayalam'},
      // {code: 'bn', name: 'Bengali'}
    ],
    defaultLanguage: 'en',
    timezone: 'Asia/Kolkata'
  },

  networks: {
    contact_links: {
      flag_email: 'riskmap@mit.edu'
    },

    deep_links: [
        {name: 'facebook', link: 'http://m.me/CognicityDevIndia'},
        // {name: 'twitter', link: 'https://twitter.com/intent/tweet?text=Report+flood&via=CognicityDev_IN'},
        {name: 'telegram', link: 'https://telegram.me/CognicityIN_bot'}
      ]
  }
};

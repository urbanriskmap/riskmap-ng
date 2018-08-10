import { deployments } from '../../app/types';

export const environment = {
  production: false,
  envName: 'dev-in',
  deploymentName: 'in' as deployments,

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
    accessToken: 'pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNqMnFraWVzYzAyd24ycXRqMmpvbmhyZ2QifQ.xc_v7umok760t2q6NZK1RA',
    center: [80.23, 13.06], // map initializes on chennai
    initZoom: 10,
    minZoom: 9,
    baseMapStyle: 'mapbox://styles/urbanriskmap/cjfvacwic1cfc2smiwbyfwcs4'
  },

  locales: {
    supportedLanguages: [
      {code: 'en', name: 'English'},
      {code: 'hi', name: 'Hindi'},
      {code: 'ta', name: 'Tamil'},
      {code: 'mr', name: 'Marathi'},
      {code: 'kn', name: 'Kannada'},
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

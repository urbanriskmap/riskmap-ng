export const environment = {
  production: false,
  envName: 'dev-us',
  deploymentName: 'us',

  servers: {
    data: 'https://data-dev.riskmap.us/',
    sensors: 'https://sensors-dev.riskmap.us/',
    web_app: 'https://dev.riskmap.us/',
    settings: {
      reportTimeperiod: 604800
    }
  },

  authorization: {
    userPoolId: 'us-west-2_olPNYtmQ7',
    appClientId: '5en9df3auvag0msrurit123v30'
  },

  map: {
    accessToken: 'pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNqZnY2cGxndzN3M3AyeHMydGVyeHcyMWIifQ.D6K1H9c8CTnP6twGYdtDKA',
    center: [-80.199261, 26.138301],
    initZoom: 10,
    minZoom: 10,
    baseMapStyle: 'mapbox://styles/urbanriskmap/cjfvacwic1cfc2smiwbyfwcs4'
  },

  locales: {
    supportedLanguages: [
      {code: 'en', name: 'English'},
      {code: 'es', name: 'Spanish'}
    ],
    defaultLanguage: 'en',
    timezone: 'America/New_York'
  },

  networks: {
    contact_links: {
      flag_email: 'risk@mit.edu'
    },

    deep_links: [
      { name: 'facebook',
        link: 'http://m.me/1747847428843379' // FB page id is used as no username is allowed at this point.
      },
      { name: 'twitter',
        link: 'https://twitter.com/messages/compose?recipient_id=915571825689624576'
      }
      // Disable telegram button for US deployment
      // {name: 'telegram', link: 'https://telegram.me/CognicityUS_bot'}
    ]
  }
};

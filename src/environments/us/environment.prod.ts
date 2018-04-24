export const environment = {
  production: true,
  envName: 'prod-us',

  servers: {
    data: 'https://data.riskmap.us/',
    sensors: 'https://sensors.riskmap.us/',
    settings: {
      reportTimeperiod: 43200
    }
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
      {name: 'facebook', link: 'http://m.me/riskmapUS'},
      //TODO after the twitter dev bot is registered
      {name: 'twitter', link: 'https://twitter.com/messages/compose?recipient_id=905602080252977152&welcome_message_id=905919155492331523&text=/flood'}/*,
      //Disable telegram button for US deployment
      {name: 'telegram', link: 'https://telegram.me/riskmapus_bot'}*/
    ]
  }
};

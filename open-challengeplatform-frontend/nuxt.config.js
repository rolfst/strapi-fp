require('dotenv').config()
module.exports = {
  env: {
    restApi: process.env.REST_API || 'http://localhost:3000',
    redirectUrl: process.env.SECURE_REDIRECT_URL,
    secureEnvironment: process.env.ENV,
    domain: process.env.DOMAIN || 'http://localhost:3000'
  },
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Business Challenge | KVK' || process.env.npm_package_name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'KVK Business Challenge'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '~assets/main-kvk.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/i18n.js',
    '~/plugins/utils.js',
    '~/plugins/axios',
    { src: '~/plugins/airbnbdatepicker.js', ssr: false },
    '~/plugins/filters.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '~/modules/router/router-config.js',
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    scss: ['~/assets/*.scss']
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {}
  }
};

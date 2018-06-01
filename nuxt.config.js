var path = require('path')

function resolve (dir) {
  return path.resolve(__dirname, dir)
}

module.exports = {
  cache: false,
  plugins: [{
    src: '~plugins/elementUI',
    ssr: true
  }],
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Nuxt.js project'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  /*
  ** Global CSS
  */
  css: ['~/assets/css/reset.css', '~/assets/css/main.css', 'element-ui/lib/theme-chalk/index.css'],
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios', 'element-ui'],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      Object.assign(config.resolve.alias, {
        'lib': resolve('lib'),
        'api': resolve('api'),
        'components': resolve('components')
      })
    }
  }
}

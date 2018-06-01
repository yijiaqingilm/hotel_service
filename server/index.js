import express from 'express'
import bodyParser from 'body-parser'
import { Nuxt, Builder } from 'nuxt'
import session from 'express-session'
import connectRedis from 'connect-redis'
import api from './api'
import redisClient from './middleware/redisConnect'

// 重写date tojson方法
Date.prototype.toJSON = function () {
  return this.getTime()
}
const secret = 'secret for hotel service'
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
app.use(bodyParser.json())
app.set('port', port)
// 测试配置 redis
let RedisStore = connectRedis(session)

app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret,
  resave: false,
}))
// Import API Routes
app.use('/api', api)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console

process.on('uncaughtException', function (err) {
  console.log('全局捕获异常', err)
})

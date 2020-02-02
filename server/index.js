const http = require('http')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

const sessionMiddleWare = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
})

// function getRoomIdFromUri (referer) {
//   const route = (referer || '').match(/\/room\/[0-9a-zA-Z]+\/?$/)
//   if (!route) {
//     return null
//   }
//   return route[0].replace(/\/room\//g, '').replace(/\//g, '')
// }

// io.use((socket, next) => {
//   sessionMiddleWare(socket.request, socket.request.res, next)
// })

// io.use((socket, next) => {
//   const roomId = getRoomIdFromUri(socket.request.headers.referer)
//   if (!roomId) {
//     return next(new Error('Invalid referer'))
//   }
//   const rooms = socket.request.session.rooms || []
//   if (!rooms.includes(roomId)) {
//     return next(new Error('Authentication failed'))
//   }

//   return next()
// })

io.on('connection', (socket) => {
  consola.info('connected')
})

async function start () {
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.set('trust proxy', 1)

  app.use(sessionMiddleWare)

  app.use('/api', require('./api'))

  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(port, host, () => {
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    })
  })
}
start()

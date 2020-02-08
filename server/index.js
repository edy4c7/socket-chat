const http = require('http')
const consola = require('consola')
const { Builder } = require('nuxt')
const config = require('../nuxt.config.js')
const nuxt = require('./middlewares/nuxt')
const app = require('./app')
const server = http.createServer(app)
const io = require('./socket')
io.attach(server)

// Import and Set Nuxt.js options
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Listen the server
  server.listen(port, host, () => {
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    })
  })
}
start()

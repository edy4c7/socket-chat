const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('./middlewares/session')
const nuxt = require('./middlewares/nuxt')

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.set('trust proxy', 1)
app.use(session)

app.use('/api', require('./api'))

// Give nuxt middleware to express
app.use(nuxt.render)

module.exports = app

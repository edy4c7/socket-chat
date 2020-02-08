const session = require('express-session')

const sessionMiddleWare = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
})

module.exports = sessionMiddleWare

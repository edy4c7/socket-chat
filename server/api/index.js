const router = require('express').Router()

const routes = {
  '/': require('./routes/greeting'),
  '/room': require('./routes/room'),
  '/auth': require('./routes/auth')
}

Object.keys(routes).forEach((path) => {
  router.use(path, routes[path])
})

module.exports = router

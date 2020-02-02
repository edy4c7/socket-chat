const router = require('express').Router()

router.post('/', (req, res) => {
  if (req.body.password !== 'password') {
    res.status(403).send(new Error('403 Forbidden!'))
    return
  }

  if (!req.session.rooms) {
    req.session.rooms = []
  }
  if (!req.session.rooms.includes(req.body.id)) {
    req.session.rooms.push(req.body.id)
  }

  res.status(200).json({ rooms: req.session.rooms })
})

module.exports = router

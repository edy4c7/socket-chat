const router = require('express').Router()

router.post('/join', (req, res) => {
  if (req.body.password !== 'password') {
    res.status(403).end()
    return
  }
  if (!req.session.rooms) {
    req.session.rooms = []
  }
  req.session.rooms.push(req.body.roomId)
  res.json({
    rooms: req.session.rooms
  })
})

router.post('/leave', (req, res) => {
  const roomId = req.body.roomId
  const rooms = req.session.rooms
  if (!roomId || !rooms) {
    res.status(400).end()
    return
  }

  req.session.rooms = rooms.filter(x => x !== roomId)
  if (req.session.rooms.length === 0) {
    req.session.rooms = undefined
  }
  res.end()
})

router.get('/user', (req, res) => {
  const rooms = req.session.rooms
  if (!rooms) {
    res.end()
    return
  }
  res.json({
    rooms: req.session.rooms
  })
})

module.exports = router

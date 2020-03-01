const router = require('express').Router()
const { getConnection } = require('typeorm')
const nanoid = require('nanoid')
const bcrypt = require('bcrypt')
const moment = require('moment')
const Room = require('../../models/Room')

function auth (req, res, next) {
  const rooms = req.session.rooms || []
  if (!rooms.includes(req.params.id)) {
    res.status(403).end()
    return
  }
  next()
}

router.post('/', (req, res) => {
  const conn = getConnection()
  let password = ''
  bcrypt.hash(req.body.password, 10)
    .then((h) => { password = h })
    .then(() => {
      const room = new Room()

      room.id = nanoid(10)
      room.password = password
      room.expireDate = moment().add(1, 'days').format()

      const repo = conn.getRepository(Room)
      return repo.save(room)
    })
    .then((room) => {
      if (!req.session.rooms) {
        req.session.rooms = []
      }
      if (!req.session.rooms.includes(room.id)) {
        req.session.rooms.push(room.id)
      }

      res.status(200).json({ roomId: room.id })
    })
    .catch((e) => {
      res.status(500).json({ message: e })
    })
})

router.get('/:id', auth, (req, res) => {
  const conn = getConnection()
  const repo = conn.getRepository(Room)
  repo.findOne({
    id: req.params.id,
    relations: ['messages']
  })
    .then((room) => {
      return res.send(room)
    })
    .catch((e) => {
      return res.status(500).send(e)
    })
})

module.exports = router

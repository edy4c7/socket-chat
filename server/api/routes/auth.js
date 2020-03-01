const router = require('express').Router()
const { getConnection } = require('typeorm')
const bcrypt = require('bcrypt')
const moment = require('moment')
const Room = require('../../models/Room')

router.post('/join', (req, res) => {
  const conn = getConnection()
  const repo = conn.getRepository(Room)
  let room = null

  repo.findOne({
    select: ['id', 'password', 'expireDate'],
    id: req.body.roomId
  })
    .then((result) => {
      room = result
      if (moment().isAfter(moment(result.expireDate))) {
        throw new Error('room is closed')
      }
      return bcrypt.compare(req.body.password, room.password)
    })
    .then((result) => {
      if (!result) {
        res.status(403).end()
        return
      }
      if (!req.session.rooms) {
        req.session.rooms = []
      }
      if (!req.session.rooms.includes(room.id)) {
        req.session.rooms.push(room.id)
      }
      res.json({
        rooms: req.session.rooms
      })
    })
    .catch(() => {
      res.status(403).end()
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

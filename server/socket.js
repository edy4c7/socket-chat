const io = require('socket.io')()
const { getConnection } = require('typeorm')
const session = require('./middlewares/session')
const Room = require('./models/Room')
const Message = require('./models/Message')

io.use((socket, next) => {
  session(socket.request, socket.request.res, next)
})

io.use((socket, next) => {
  const roomId = socket.handshake.query.roomId
  const rooms = socket.request.session.rooms || []
  if (!rooms.includes(roomId)) {
    return next(new Error('Unauthorized'))
  }

  return next()
})

io.on('connection', (socket) => {
  const conn = getConnection()
  const roomRepo = conn.getRepository(Room)
  roomRepo.findOne({ id: socket.handshake.query.roomId })
    .then((room) => {
      socket.join(room.id, () => {
        socket.broadcast.to(room.id).emit('joined')
      })
      socket.on('send', (param) => {
        const message = new Message()
        message.text = param.message
        message.room = room

        const messageRepo = conn.getRepository(Message)
        messageRepo.save(message)
          .then((m) => {
            io.to(room.id).emit('incoming', m)
          })
      })
      socket.on('leave', () => {
        socket.leave(room.id)
        const joinedRooms = socket.request.session.rooms || []
        socket.request.session.rooms = joinedRooms.filter(x => x !== room.id)
      })
    })
})

module.exports = io

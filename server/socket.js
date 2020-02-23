const io = require('socket.io')()
const session = require('./middlewares/session')

io.use((socket, next) => {
  session(socket.request, socket.request.res, next)
})

io.on('connection', (socket) => {
  const roomId = socket.handshake.query.roomId

  socket.join(roomId, () => {
    io.to(socket.id).emit('joined')
  })
  socket.on('send', (param) => {
    io.to(roomId).emit('incoming', {
      message: param.message
    })
  })
  socket.on('leave', () => {
    socket.leave(roomId)
    const joinedRooms = socket.request.session.rooms || []
    socket.request.session.rooms = joinedRooms.filter(x => x !== roomId)
  })
})

module.exports = io

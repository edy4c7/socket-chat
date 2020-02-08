const io = require('socket.io')()
const session = require('./middlewares/session')

io.use((socket, next) => {
  session(socket.request, socket.request.res, next)
})

io.on('connection', (socket) => {
})

module.exports = io

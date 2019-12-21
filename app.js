const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cookieParser = require('cookie-parser');

app.set('view engine', 'pug');
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

function restrict(req, res, next) {
  if(!req.cookies.token) {
    res.status(403);
    res.render('index')
  } else {
    next();
  }
}

app.get('/', (req, res) => {
  res.render('index')
});

app.post('/room', (req, res) => {
  if(req.body.password == 'password'){
    res.cookie('token', 'token1234');
    res.redirect(`/room/${req.body.id}`);
  } else {
    res.status(403);
    res.render('index')
  }
});

app.get('/room/:roomId', restrict, (req, res) => {
  res.render('chat', {token: req.cookies.token});
});

io.use((socket, next) => {
  if(socket.handshake.query.token !== 'token1234') {
    console.error('Authentication failed');
    return next(new Error('Authentication failed'));
  }
  console.log('Authentication success');
  return next();
});

io.on('connection', (socket) => {
  let room = '';

  console.log(`a user connected. Id is ${socket.id}`);
  socket.on('join_to_room', (roomId) => {
    socket.join(roomId, () => {
      room = roomId;  
      console.log(`${socket.id} joined to ${roomId}`);
      io.to(socket.id).emit('joined_to_room', { roomId });
    });
  });

  socket.on('chat message', (msg) => {
    io.to(room).emit('chat message', msg);
  });
  socket.on('leave_from_room', () => {
    socket.leave(room);
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on port 3000');
});
const express = require('express');
const app = express();
const session = require('express-session')
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cookieParser = require('cookie-parser');

app.set('view engine', 'pug');
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.set('trust proxy', 1)

function getRoomIdFromUri(referer) {
  let route = (referer || '').match(/\/room\/[0-9a-zA-Z]+\/?$/);
  if(!route) return null;
  return route[0].replace(/\/room\//g, '')
              .replace(/\//g, '');
}

const sessionMiddleWare = session({
  secret: 'keyboard cat',
  resave: false,
});

app.use(sessionMiddleWare);

app.get('/', (req, res) => {
  res.render('index')
});

app.post('/room', (req, res) => {
  if(!req.body.password == 'password'){
    res.status(403);
    res.render('index');
    return;
  }
  if(!req.session.rooms) req.session.rooms = [];
  req.session.rooms.push(req.body.id);
  res.redirect(`/room/${req.body.id}`);
});

app.get('/room/:roomId',
  (req, res, next) => {
    const rooms = req.session.rooms || [];
    if(!rooms.includes(req.params.roomId)) {
      res.status(403);
      res.redirect('/')
    } else {
      next();
    }
  },
  (req, res) => {
    res.render('chat');
  }
);

io.use((socket, next) => {
  sessionMiddleWare(socket.request, socket.request.res, next);
});

io.use((socket, next) => {
  let roomId = getRoomIdFromUri(socket.request.headers.referer);
  if(!roomId){
    console.error('Invalid referer');
    return next(new Error('Invalid referer'));
  }
  let rooms = socket.request.session.rooms || [];
  if(!rooms.includes(roomId)) {
    console.error('Authentication failed');
    return next(new Error('Authentication failed'));
  }

  console.log('Authentication success');
  return next();
});

io.on('connection', (socket) => {
  console.log(`a user connected. Id is ${socket.id}`);

  let requestRoomId = getRoomIdFromUri(socket.request.headers.referer);
  
  let room = '';
  socket.join(requestRoomId, () => {
    room = requestRoomId;  
    console.log(`${socket.id} joined to ${requestRoomId}`);
    io.to(socket.id).emit('joined_to_room', { requestRoomId });
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
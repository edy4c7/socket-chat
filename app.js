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

const sessionMiddleWare = session({
  secret: 'keyboard cat',
  resave: false,
});

app.use(sessionMiddleWare);

function restrict(req, res, next) {
  if(!req.session.room) {
    res.status(403);
    res.redirect('/')
  } else {
    next();
  }
}

app.get('/', (req, res) => {
  res.render('index')
});

app.post('/room', (req, res) => {
  if(req.body.password == 'password'){
    req.session.room = req.body.id
    res.redirect(`/room/${req.body.id}`);
  } else {
    res.status(403);
    res.render('index')
  }
});

app.get('/room/:roomId', restrict, (req, res) => {
  res.render('chat');
});

io.use((socket, next) => {
  sessionMiddleWare(socket.request, socket.request.res, next);
});

io.use((socket, next) => {
  if(!socket.request.session.room) {
    console.error('Authentication failed');
    return next(new Error('Authentication failed'));
  }
  let referer = socket.request.headers.referer || '';
  if(!/\/room\/[0-9a-zA-Z]+\/?$/.test(referer)){
    console.error('Invalid referer');
    return next(new Error('Invalid referer'));
  }

  console.log('Authentication success');
  return next();
});

io.on('connection', (socket) => {
  console.log(`a user connected. Id is ${socket.id}`);

  let referer = socket.request.headers.referer;
  let requestRoomId = referer.match(/\/[0-9a-zA-Z]+\/?$/)[0].replace(/\//g, '');
  
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
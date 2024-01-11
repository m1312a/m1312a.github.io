const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`💗 server on port ${PORT}`));
const io = require('socket.io')(server);
app.use(express.static(path.join(__dirname, 'public')));

let socketConected = new Set();

io.on('connection', on);

function on(socket) {
  console.log(socket.id);
  socketConected.add(socket.id);
  
  io.emit('clients-total', socketConected.size);

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
    socketConected.delete(socket.id);
    io.emit('clients-total', socketConected.size);
  });
  socket.on('message',(data) => {
    console.log(data)
    socket.broadcast.emit('chat-message',data)
  })
  socket.on('feedback',(data) => {
    socket.broadcast.emit('feedback',data)
  })
}

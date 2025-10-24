// Socket.IO bootstrap (placeholder)
function registerSockets(io) {
  io.use(require('./socketAuth'));
  io.on('connection', (socket) => {
    // Lightweight clock sync: client emits 'time:ping', server replies immediately with serverTime
    socket.on('time:ping', (data) => {
      try {
        socket.emit('time:pong', { serverTime: Date.now(), echo: data });
      } catch {}
    });
    require('./room.socket')(io, socket);
    require('./player.socket')(io, socket);
    require('./chat.socket')(io, socket);
  });
}

module.exports = { registerSockets };

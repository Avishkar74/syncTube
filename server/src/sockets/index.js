// Socket.IO bootstrap (placeholder)
function registerSockets(io) {
  io.use(require('./socketAuth'));
  io.on('connection', (socket) => {
    require('./room.socket')(io, socket);
    require('./player.socket')(io, socket);
    require('./chat.socket')(io, socket);
  });
}

module.exports = { registerSockets };

// Player socket events (placeholder)
module.exports = function playerSocket(_io, socket) {
  socket.on('player:play', (roomId, t) => socket.to(roomId).emit('player:play', t));
  socket.on('player:pause', (roomId, t) => socket.to(roomId).emit('player:pause', t));
  socket.on('player:seek', (roomId, t) => socket.to(roomId).emit('player:seek', t));
};

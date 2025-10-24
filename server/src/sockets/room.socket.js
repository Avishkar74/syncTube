// Room socket namespace (placeholder)
module.exports = function roomSocket(_io, socket) {
  socket.on('room:join', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('room:joined', { userId: socket.id });
  });
};

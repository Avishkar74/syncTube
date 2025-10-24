// Chat socket events (placeholder)
module.exports = function chatSocket(_io, socket) {
  socket.on('chat:message', (roomId, message) => {
    socket.to(roomId).emit('chat:message', { ...message, userId: socket.id, at: Date.now() });
  });
};

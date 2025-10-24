// Socket handshake auth placeholder middleware
module.exports = (socket, next) => {
  // e.g., read token from socket.handshake.auth.token
  // For now, allow all
  next();
};

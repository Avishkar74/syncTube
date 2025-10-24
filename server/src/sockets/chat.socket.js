// Chat socket events: persist and broadcast
const Room = require('../models/Room');
const Message = require('../models/Message');

module.exports = function chatSocket(io, socket) {
  // Client emits: { code, senderName, text }
  socket.on('chat:message', async (payload) => {
    try {
      const { code, senderName, text } = payload || {};
      if (!code || !senderName || !text) return;

      const room = await Room.findOne({ code }).select('_id code').lean();
      if (!room) {
        socket.emit('chat:error', { message: 'Room not found' });
        return;
      }

      const saved = await Message.create({ room: room._id, senderName, text });
      const out = {
        id: saved._id.toString(),
        code: room.code,
        senderName: saved.senderName,
        text: saved.text,
        createdAt: saved.createdAt,
      };

      io.in(code).emit('chat:message', out);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('chat:message error', err);
      socket.emit('chat:error', { message: 'Failed to send message' });
    }
  });
};

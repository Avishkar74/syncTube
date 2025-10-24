// Room socket events: join/leave and user lists
const Room = require('../models/Room');
const { userJoin, userLeave, getRoomUsers } = require('./participants');

module.exports = function roomSocket(io, socket) {
  // Client emits: { code, name }
  socket.on('room:join', async ({ code, name }) => {
    if (!code || !name) return;
    console.log('[io] room:join', { socketId: socket.id, code, name });

    const room = await Room.findOne({ code, active: true }).lean();
    if (!room) {
      socket.emit('room:error', { message: 'Room not found or inactive' });
      return;
    }

    socket.join(code);
    const user = userJoin({ socketId: socket.id, name, roomCode: code });

    // Notify others and send back current users list
  socket.to(code).emit('room:user-joined', { id: user.id, name: user.name });
    io.in(code).emit('room:users', getRoomUsers(code));

    // Send current video state to the newly joined user so they sync immediately
    const v = room.currentVideo || {};
    if (v && v.videoId) {
      // If the room is currently playing, advance the position by elapsed wall time since last update
      let pos = Math.floor(v.positionSeconds || 0);
      if (v.isPlaying && v.updatedAt) {
        const updatedAtMs = new Date(v.updatedAt).getTime();
        if (Number.isFinite(updatedAtMs)) {
          const elapsed = (Date.now() - updatedAtMs) / 1000;
          pos = Math.max(0, Math.floor(pos + elapsed));
        }
      }
      const payload = {
        videoId: v.videoId,
        title: v.title || '',
        positionSeconds: pos,
        isPlaying: !!v.isPlaying,
        serverTime: Date.now(),
      };
      console.log('[io] send snapshot to joiner', payload);
      socket.emit('player:video', payload);
    }
  });

  socket.on('disconnect', () => {
    const left = userLeave(socket.id);
    if (left && left.roomCode) {
      socket.to(left.roomCode).emit('room:user-left', { id: left.user.id, name: left.user.name });
      io.in(left.roomCode).emit('room:users', getRoomUsers(left.roomCode));
    }
  });
};

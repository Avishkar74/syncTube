// Player socket events: broadcast and persist minimal state
const Room = require('../models/Room');

module.exports = function playerSocket(io, socket) {
  socket.on('player:set-video', async ({ code, videoId, title }) => {
    try {
      if (!code || !videoId) return;
      const now = new Date();
      await Room.updateOne(
        { code },
        {
          $set: {
            'currentVideo.videoId': videoId,
            'currentVideo.title': title || '',
            'currentVideo.positionSeconds': 0,
            'currentVideo.isPlaying': false,
            'currentVideo.updatedAt': now,
          },
        }
      );
      io.in(code).emit('player:video', { videoId, title: title || '' });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('player:set-video error', err);
      socket.emit('player:error', { message: 'Failed to set video' });
    }
  });

  socket.on('player:play', async ({ code, positionSeconds }) => {
    try {
      if (!code) return;
      const now = new Date();
      await Room.updateOne(
        { code },
        {
          $set: {
            'currentVideo.isPlaying': true,
            'currentVideo.positionSeconds': positionSeconds ?? 0,
            'currentVideo.updatedAt': now,
          },
        }
      );
      io.in(code).emit('player:play', { positionSeconds: positionSeconds ?? 0 });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('player:play error', err);
    }
  });

  socket.on('player:pause', async ({ code, positionSeconds }) => {
    try {
      if (!code) return;
      const now = new Date();
      await Room.updateOne(
        { code },
        {
          $set: {
            'currentVideo.isPlaying': false,
            'currentVideo.positionSeconds': positionSeconds ?? 0,
            'currentVideo.updatedAt': now,
          },
        }
      );
      io.in(code).emit('player:pause', { positionSeconds: positionSeconds ?? 0 });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('player:pause error', err);
    }
  });

  socket.on('player:seek', async ({ code, positionSeconds }) => {
    try {
      if (!code) return;
      const now = new Date();
      await Room.updateOne(
        { code },
        {
          $set: {
            'currentVideo.positionSeconds': positionSeconds ?? 0,
            'currentVideo.updatedAt': now,
          },
        }
      );
      io.in(code).emit('player:seek', { positionSeconds: positionSeconds ?? 0 });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('player:seek error', err);
    }
  });
};

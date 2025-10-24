// Player socket events: broadcast and persist minimal state
const Room = require('../models/Room');

module.exports = function playerSocket(io, socket) {
  socket.on('player:set-video', async ({ code, videoId, title }) => {
    try {
      if (!code || !videoId) return;
      console.log('[io] player:set-video', { code, videoId, title });
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
      io.in(code).emit('player:video', {
        videoId,
        title: title || '',
        positionSeconds: 0,
        isPlaying: false,
        serverTime: Date.now(),
      });
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
      // include serverTime so clients can compensate network delay
      // Notify everyone except the sender to avoid echo
      const payload = { positionSeconds: positionSeconds ?? 0, serverTime: Date.now() };
      console.log('[io] player:play -> room', code, payload);
      socket.to(code).emit('player:play', payload);
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
      // Notify everyone except the sender to avoid echo
      const payload = { positionSeconds: positionSeconds ?? 0, serverTime: Date.now() };
      console.log('[io] player:pause -> room', code, payload);
      socket.to(code).emit('player:pause', payload);
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
      // Notify everyone except the sender to avoid echo
      const payload = { positionSeconds: positionSeconds ?? 0, serverTime: Date.now() };
      console.log('[io] player:seek -> room', code, payload);
      socket.to(code).emit('player:seek', payload);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('player:seek error', err);
    }
  });

  // Allow clients to request the current snapshot at any time (e.g., after reconnect)
  socket.on('player:resync', async ({ code }) => {
    try {
      if (!code) return;
      const room = await Room.findOne({ code }).lean();
      if (!room || !room.currentVideo || !room.currentVideo.videoId) return;
      const v = room.currentVideo;
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
      console.log('[io] player:resync -> emit snapshot', payload);
      socket.emit('player:video', payload);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('player:resync error', err);
    }
  });
};

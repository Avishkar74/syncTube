// Room controller (placeholder)
const roomService = require('../services/room.service');

exports.createRoom = async (req, res) => {
  const room = await roomService.createRoom(req.body || {});
  res.status(201).json(room);
};

exports.getRoom = async (req, res) => {
  const room = await roomService.getRoom(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json(room);
};

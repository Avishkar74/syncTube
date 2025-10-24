const Room = require('../models/Room');

function genCode(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

exports.createRoom = async (req, res, next) => {
  try {
    const { hostName } = req.body || {};
    if (!hostName || !hostName.trim()) {
      return res.status(400).json({ message: 'hostName required' });
    }

    // Generate a unique room code with a few retries
    let code;
    for (let i = 0; i < 5; i++) {
      code = genCode(6);
      const exists = await Room.findOne({ code }).lean();
      if (!exists) break;
      code = null;
    }
    if (!code) return res.status(500).json({ message: 'Failed to generate room code' });

    const room = await Room.create({
      code,
      hostName: hostName.trim(),
      currentVideo: {},
      active: true,
    });

    res.status(201).json({ room });
  } catch (err) {
    next(err);
  }
};

exports.getRoom = async (req, res, next) => {
  try {
    const { code } = req.params;
    const room = await Room.findOne({ code }).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ room });
  } catch (err) {
    next(err);
  }
};

exports.endRoom = async (req, res, next) => {
  try {
    const { code } = req.params;
    const room = await Room.findOneAndUpdate(
      { code },
      { $set: { active: false } },
      { new: true }
    ).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ room });
  } catch (err) {
    next(err);
  }
};

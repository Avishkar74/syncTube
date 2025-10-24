const Message = require('../models/Message');
const Room = require('../models/Room');

exports.list = async (req, res, next) => {
  try {
    const { code } = req.params;
    const room = await Room.findOne({ code }).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const messages = await Message.find({ room: room._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json({ messages: messages.reverse() });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { senderName, text, system = false } = req.body || {};
    if (!senderName || !senderName.trim()) return res.status(400).json({ message: 'senderName required' });
    if (!text || !text.trim()) return res.status(400).json({ message: 'text required' });
    const room = await Room.findOne({ code });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    const message = await Message.create({
      room: room._id,
      senderName: senderName.trim(),
      text: text.trim(),
      system: Boolean(system),
    });
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
};

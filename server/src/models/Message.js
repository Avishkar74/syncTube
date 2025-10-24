const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    senderName: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    system: { type: Boolean, default: false }, // for join/leave/system notices if needed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
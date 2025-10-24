const mongoose = require('mongoose');

const { Schema } = mongoose;

const CurrentVideoSchema = new Schema(
  {
    videoId: { type: String, trim: true },
    title: { type: String, trim: true },
    positionSeconds: { type: Number, default: 0 },
    isPlaying: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const RoomSchema = new Schema(
  {
    code: { type: String, required: true, trim: true }, // ensure uniqueness in service logic
    hostName: { type: String, required: true, trim: true },
    currentVideo: { type: CurrentVideoSchema, default: () => ({}) },
    active: { type: Boolean, default: true }, // host can end room => set to false
  },
  { timestamps: true }
);

// Add an index to enforce unique room codes at the DB level
RoomSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model('Room', RoomSchema);
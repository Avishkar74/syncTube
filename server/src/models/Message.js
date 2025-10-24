// Placeholder Message model
module.exports = class Message {
  constructor({ id, roomId, userId, text, createdAt = new Date() }) {
    this.id = id;
    this.roomId = roomId;
    this.userId = userId;
    this.text = text;
    this.createdAt = createdAt;
  }
};

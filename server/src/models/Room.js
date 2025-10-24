// Placeholder Room model
module.exports = class Room {
  constructor({ id, hostId, createdAt = new Date() }) {
    this.id = id;
    this.hostId = hostId;
    this.createdAt = createdAt;
  }
};

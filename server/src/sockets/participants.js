// Simple in-memory participant registry per room
// Not persisted; cleared on process restart

const participantsByRoom = new Map(); // roomCode -> Map(socketId -> { id, name })

function userJoin({ socketId, name, roomCode }) {
  if (!participantsByRoom.has(roomCode)) {
    participantsByRoom.set(roomCode, new Map());
  }
  const roomMap = participantsByRoom.get(roomCode);
  const user = { id: socketId, name };
  roomMap.set(socketId, user);
  return user;
}

function userLeave(socketId) {
  for (const [roomCode, roomMap] of participantsByRoom.entries()) {
    if (roomMap.has(socketId)) {
      const user = roomMap.get(socketId);
      roomMap.delete(socketId);
      if (roomMap.size === 0) participantsByRoom.delete(roomCode);
      return { user, roomCode };
    }
  }
  return null;
}

function getRoomUsers(roomCode) {
  const roomMap = participantsByRoom.get(roomCode);
  if (!roomMap) return [];
  return Array.from(roomMap.values());
}

module.exports = { userJoin, userLeave, getRoomUsers };

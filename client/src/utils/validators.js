export function isValidRoomCode(code) {
  return /^[A-Za-z0-9_-]{4,16}$/.test(code || '');
}

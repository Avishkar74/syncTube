// Room service (placeholder)
exports.createRoom = async (data) => ({ id: data?.id || 'room_' + Date.now(), hostId: data?.hostId || null });
exports.getRoom = async (id) => (id ? { id } : null);

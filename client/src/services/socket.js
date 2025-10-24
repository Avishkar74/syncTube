import { io } from 'socket.io-client';

// Prefer same-origin so Vite dev proxy can forward to the API & WebSocket server.
// Set VITE_SOCKET_URL in production if the socket server is on a different host.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || undefined; // undefined => same-origin

let socketInstance = null;

export function getSocket() {
  if (socketInstance) return socketInstance;
  // Let Socket.IO choose the best transport (polling fallback helps behind proxies)
  socketInstance = io(SOCKET_URL, {
    autoConnect: true,
  });
  // Debug logging for connection lifecycle
  socketInstance.on('connect', () => {
    console.log('[socket] connected', { id: socketInstance.id, url: SOCKET_URL || 'same-origin' });
  });
  socketInstance.on('connect_error', (err) => {
    console.error('[socket] connect_error', err?.message || err);
  });
  socketInstance.on('disconnect', (reason) => {
    console.warn('[socket] disconnected', reason);
  });
  socketInstance.io.on('reconnect_attempt', (attempt) => {
    console.log('[socket] reconnect_attempt', attempt);
  });
  socketInstance.io.on('reconnect', (attempt) => {
    console.log('[socket] reconnected', attempt);
  });
  return socketInstance;
}

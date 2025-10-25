import { io } from 'socket.io-client';

// Prefer same-origin so Vite dev proxy can forward to the API & WebSocket server.
// Set VITE_SOCKET_URL in production if the socket server is on a different host.
// Trim trailing slashes to avoid hitting //socket.io which some servers won't route.
const RAW_SOCKET_URL = import.meta.env.VITE_SOCKET_URL || undefined; // undefined => same-origin
const SOCKET_URL = RAW_SOCKET_URL ? RAW_SOCKET_URL.replace(/\/+$/, '') : undefined;
// Allow forcing transports/upgrade via env (useful on some hosts)
const SOCKET_TRANSPORTS = (import.meta.env.VITE_SOCKET_TRANSPORTS || 'polling,websocket')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const SOCKET_UPGRADE = (import.meta.env.VITE_SOCKET_UPGRADE || 'true').toLowerCase() !== 'false';

let socketInstance = null;

export function getSocket() {
  if (socketInstance) return socketInstance;
  // Let Socket.IO choose the best transport (polling fallback helps behind proxies)
  socketInstance = io(SOCKET_URL, {
    autoConnect: true,
    withCredentials: true,
    path: '/socket.io',
    transports: SOCKET_TRANSPORTS,
    upgrade: SOCKET_UPGRADE,
  });
  // Debug logging for connection lifecycle
  socketInstance.on('connect', () => {
  console.log('[socket] connected', { id: socketInstance.id, url: SOCKET_URL || 'same-origin', transports: SOCKET_TRANSPORTS, upgrade: SOCKET_UPGRADE });
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

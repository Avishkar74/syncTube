// Minimal Socket.IO client wrapper placeholder. Replace with real socket.io-client.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export function createSocket() {
  // TODO: initialize socket.io-client here
  return {
    on: () => {},
    emit: () => {},
    disconnect: () => {}
  };
}

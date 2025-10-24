import { useMemo } from 'react';
import { getSocket } from '../services/socket';

// Returns the shared Socket.IO client instance (singleton).
export default function useSocket() {
  const socket = useMemo(() => getSocket(), []);
  return socket;
}

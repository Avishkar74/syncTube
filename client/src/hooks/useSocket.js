import { useEffect, useRef } from 'react';
import { createSocket } from '../services/socket';

export default function useSocket() {
  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = createSocket();
    return () => socketRef.current?.disconnect?.();
  }, []);
  return socketRef.current;
}

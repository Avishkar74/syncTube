import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import YouTubePlayer from '../components/player/YouTubePlayer';
import ChatPanel from '../components/chat/ChatPanel';
import RoomHeader from '../components/room/RoomHeader';
import useSocket from '../hooks/useSocket';

export default function Room() {
  // Ensure we join the room as early as possible using the shared socket
  const { id: code } = useParams();
  const socket = useSocket();
  const name = useMemo(() => localStorage.getItem('syncTube:name') || 'Guest', []);

  useEffect(() => {
    if (!socket || !code) return;
    socket.emit('room:join', { code, name });
  }, [socket, code, name]);

  return (
    <div className="w-full h-full bg-gray-900 gap-4 p-4 grid xl:grid-cols-[3fr,1fr] xl:grid-rows-[1fr] grid-rows-[2fr,1fr]">
      <YouTubePlayer />
      <ChatPanel />
    </div>
  );
}

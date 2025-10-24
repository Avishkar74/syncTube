import YouTubePlayer from '../components/player/YouTubePlayer';
import ChatPanel from '../components/chat/ChatPanel';
import RoomHeader from '../components/room/RoomHeader';

export default function Room() {
  return (
    <div style={{ padding: 16 }}>
      <RoomHeader />
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <YouTubePlayer />
        <ChatPanel />
      </div>
    </div>
  );
}

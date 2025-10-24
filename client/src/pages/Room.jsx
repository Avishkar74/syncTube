import YouTubePlayer from '../components/player/YouTubePlayer';
import ChatPanel from '../components/chat/ChatPanel';

export default function Room() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, padding: 16 }}>
      <YouTubePlayer />
      <ChatPanel />
    </div>
  );
}

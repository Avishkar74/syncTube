import YouTubePlayer from '../components/player/YouTubePlayer';
import ChatPanel from '../components/chat/ChatPanel';
import RoomHeader from '../components/room/RoomHeader';

export default function Room() {
  return (
    <div className="w-full h-full bg-gray-900 gap-4 p-4 grid xl:grid-cols-[3fr,1fr] xl:grid-rows-[1fr] grid-rows-[2fr,1fr]">
      <YouTubePlayer />
      <ChatPanel />
    </div>
  );
}

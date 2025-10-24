import { Link, useParams } from 'react-router-dom';
import VideoIdInput from '../video-id-input/VideoIdInput';
import useSocket from '../../hooks/useSocket';

export default function Header() {
  const { id: code } = useParams();
  const socket = useSocket();

  const handleSelectVideo = (item) => {
    if (!item?.videoId || !socket || !code) return;
    console.log('[ui] select video', { code, videoId: item.videoId, title: item.title });
    socket.emit('player:set-video', { code, videoId: item.videoId, title: item.title });
  };

  return (
    <header className="w-full bg-gray-800 text-white grid sm:grid-cols-[1fr,4fr,1fr] items-center gap-2 px-4 py-2">
      <div className="font-bold text-lg">
        <Link to="/" className="select-none">syncTube</Link>
      </div>
      <div className="flex items-center justify-center">
        {/* Center search input like the reference design */}
        <div className="w-[30rem] max-w-full">
          <VideoIdInput onSelect={handleSelectVideo} />
        </div>
      </div>
      <div className="flex justify-end">
        <a className="underline text-sm" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </header>
  );
}

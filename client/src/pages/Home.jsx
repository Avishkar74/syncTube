import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { apiPost } from '../services/apiClient';

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState(localStorage.getItem('syncTube:name') || '');
  const [code, setCode] = useState('');

  const saveName = (val) => {
    setName(val);
    localStorage.setItem('syncTube:name', val);
  };

  const createRoom = async () => {
    if (!name.trim()) return alert('Please enter your name');
    try {
      const res = await apiPost('/api/rooms', { hostName: name.trim() });
      const roomCode = res?.room?.code || res?.code || res?.room?.code;
      navigate(`/room/${roomCode}`);
    } catch (err) {
      console.error('[ui] createRoom failed', err);
      alert('Failed to create room');
    }
  };

  const joinRoom = (e) => {
    e?.preventDefault?.();
    if (!name.trim()) return alert('Please enter your name');
    if (!code.trim()) return alert('Enter a room code');
    navigate(`/room/${code.trim()}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-900 to-black text-gray-100 flex items-center justify-center px-4">
      <section className="w-full max-w-2xl">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 shadow-xl backdrop-blur-sm p-6 sm:p-8">
          <header className="mb-6 sm:mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">syncTube</span>
            </h1>
            <p className="mt-2 text-gray-400">Create a room or join one to watch YouTube together in sync.</p>
          </header>

          <div className="grid gap-6">
            <div className="grid gap-2">
              <label className="text-sm text-gray-300">Your name</label>
              <Input
                value={name}
                onChange={(e) => saveName(e.target.value)}
                placeholder="e.g., Alice"
                className="bg-gray-800/70 border-gray-700"
              />
              <p className="text-xs text-gray-500">We’ll remember this on this device.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-medium">Start a new room</h2>
                <p className="text-sm text-gray-400">You’ll get a short code to share with friends.</p>
              </div>
              <Button onClick={createRoom} className="whitespace-nowrap px-4 py-2">Create room</Button>
            </div>

            <div className="grid gap-3 pt-2">
              <h2 className="text-lg font-medium">Join with a code</h2>
              <form onSubmit={joinRoom} className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  inputMode="text"
                  className="uppercase tracking-wider"
                />
                <Button type="submit" className="px-4 py-2">Join</Button>
              </form>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">Tip: paste a YouTube link after entering the room.</p>
      </section>
    </div>
  );
}

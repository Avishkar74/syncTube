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

  const joinRoom = () => {
    if (!name.trim()) return alert('Please enter your name');
    if (!code.trim()) return alert('Enter a room code');
    navigate(`/room/${code.trim()}`);
  };

  return (
    <section style={{ padding: 24, display: 'grid', gap: 16, maxWidth: 640, margin: '0 auto' }}>
      <h1>Welcome to syncTube</h1>
      <p>Create a room or join an existing one to start watching together.</p>

      <div style={{ display: 'grid', gap: 8 }}>
        <label>Your name</label>
        <Input value={name} onChange={(e) => saveName(e.target.value)} placeholder="e.g., Alice" />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={createRoom}>Create room</Button>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <label>Join with code</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ABC123" />
          <Button onClick={joinRoom}>Join</Button>
        </div>
      </div>
    </section>
  );
}

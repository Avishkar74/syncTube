import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

// JoinRoom: captures display name and room code, and calls onJoin(name, code)
export default function JoinRoom({ defaultName = '', onJoin }) {
  const [name, setName] = useState(defaultName || localStorage.getItem('syncTube:name') || '');
  const [code, setCode] = useState('');

  useEffect(() => {
    localStorage.setItem('syncTube:name', name);
  }, [name]);

  const handleJoin = () => {
    if (!name.trim()) return alert('Please enter your name');
    if (!code.trim()) return alert('Enter a room code');
    onJoin?.(name.trim(), code.trim());
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'grid', gap: 6 }}>
        <label>Your name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Alice" />
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        <label>Room code</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ABC123" />
          <Button onClick={handleJoin}>Join</Button>
        </div>
      </div>
    </div>
  );
}

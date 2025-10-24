import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function JoinRoomForm({ onJoin }) {
  const [code, setCode] = useState('');
  const join = () => {
    if (!code.trim()) return;
    onJoin?.(code);
  };
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter room code" />
      <Button onClick={join}>Join</Button>
    </div>
  );
}

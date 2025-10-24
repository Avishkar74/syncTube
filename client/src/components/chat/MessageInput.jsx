import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function MessageInput() {
  const [text, setText] = useState('');
  const send = () => {
    if (!text.trim()) return;
    // TODO: emit via socket
    setText('');
  };
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" />
      <Button onClick={send}>Send</Button>
    </div>
  );
}

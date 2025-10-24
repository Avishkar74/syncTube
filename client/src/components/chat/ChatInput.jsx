import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

// ChatInput: text box + send button
// Props: onSend(text: string)
export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setText('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type a message"
      />
      <Button onClick={send} disabled={!text.trim()}>Send</Button>
    </div>
  );
}

import { useState } from 'react';
import Input from '../ui/Input';

// ChatInput: text box + send button
// Props: onSend(text: string)
export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');


  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setText('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full h-full px-2 flex items-center gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Send a message..."
        className="ring-0 focus:ring-gray-900"
      />
      <div
        onClick={handleSend}
        className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex justify-center items-center text-white font-bold cursor-pointer select-none"
      >
        {`>`}
      </div>
    </div>
  );
}

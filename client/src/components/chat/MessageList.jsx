import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

// MessageList: renders a scrollable list of messages
// Props:
// - messages: Array<{ id?/_id?, senderName, text, createdAt, system?, userId? }>
// - currentId?: string (socket id) and/or currentName?: string to mark own messages
export default function MessageList({ messages = [], currentId, currentName }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    // auto scroll to bottom when messages update
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const isOwn = (m) => {
    if (currentId && m.userId && currentId === m.userId) return true;
    if (currentName && m.senderName && currentName === m.senderName) return true;
    return false;
  };

  return (
    <div ref={scrollRef} className="w-full h-full flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-2 bg-gray-600 rounded">
      {(!messages || messages.length === 0) ? (
        <p className="text-gray-400">No messages yet</p>
      ) : (
        messages.map((m) => (
          <ChatMessage
            key={m.id || m._id || `${m.senderName}-${m.createdAt}-${m.text}`}
            message={m}
            isOwn={isOwn(m)}
          />
        ))
      )}
    </div>
  );
}

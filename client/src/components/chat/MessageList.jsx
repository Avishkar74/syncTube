import { useState } from 'react';

export default function MessageList() {
  const [messages] = useState([]);
  return (
    <div style={{ overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, height: '100%' }}>
      {messages.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No messages yet</p>
      ) : (
        messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <strong>{m.user || 'User'}: </strong>
            <span>{m.text}</span>
          </div>
        ))
      )}
    </div>
  );
}

// Renders a single chat message
// Props:
// - message: { senderName, text, createdAt, system? }
// - isOwn: boolean (optional) to style current user's messages

export default function ChatMessage({ message, isOwn = false }) {
  const { senderName, text, createdAt, system } = message || {};
  const time = createdAt ? new Date(createdAt) : null;
  const timeStr = time
    ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  if (system) {
    return (
      <div style={{ textAlign: 'center', margin: '6px 0' }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{text}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 2,
        margin: '8px 0',
        alignSelf: isOwn ? 'end' : 'start',
        maxWidth: '100%'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <strong style={{ color: '#111827' }}>{isOwn ? 'You' : senderName}</strong>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>{timeStr}</span>
      </div>
      <div
        style={{
          background: isOwn ? '#dbeafe' : '#f3f4f6',
          color: '#111827',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '8px 10px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
      >
        {text}
      </div>
    </div>
  );
}

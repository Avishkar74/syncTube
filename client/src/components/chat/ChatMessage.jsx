// Renders a single chat message
// Props:
// - message: { senderName, text, createdAt, system? }
// - isOwn: boolean (optional) to style current user's messages

export default function ChatMessage({ message, isOwn = false }) {
  const { senderName, text, createdAt, system, color } = message || {};
  const time = createdAt ? new Date(createdAt) : null;
  const timeStr = time
    ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  if (system) {
    return (
      <div className="text-center my-1">
        <span className="text-xs text-gray-400">{text}</span>
      </div>
    );
  }

  return (
    <div className={`w-full flex ${isOwn ? 'justify-end' : ''}`}>
      <div className={`max-w-[16rem] border-gray-800 rounded-md border p-2 text-white ${isOwn ? 'bg-gray-500' : 'bg-gray-700'}`}>
        <div className="flex flex-col">
          {!isOwn && (
            <span style={{ color: color || '#fff' }}>{senderName}</span>
          )}
          <span>{text}</span>
          {timeStr ? <span className="text-[10px] text-gray-300 self-end mt-1">{timeStr}</span> : null}
        </div>
      </div>
    </div>
  );
}

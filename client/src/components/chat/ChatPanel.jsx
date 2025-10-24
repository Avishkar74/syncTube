import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatPanel() {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MessageList />
      </div>
      <MessageInput />
    </aside>
  );
}

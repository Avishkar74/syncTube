import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ChatUsers from './ChatUsers';
import useSocket from '../../hooks/useSocket';
import { apiGet } from '../../services/apiClient';

export default function ChatPanel() {
  const { id: code } = useParams();
  const socket = useSocket();
  const name = useMemo(() => localStorage.getItem('syncTube:name') || 'Guest', []);

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [socketId, setSocketId] = useState(null);

  // Load history
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiGet(`/api/rooms/${code}/messages`);
        if (active) setMessages(res.messages || []);
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, [code]);

  // Socket wiring
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => setSocketId(socket.id);
    socket.on('connect', onConnect);

    // join room
    socket.emit('room:join', { code, name });

    const onChat = (msg) => setMessages((prev) => [...prev, msg]);
    const onUsers = (list) => setUsers(Array.isArray(list) ? list : []);

    socket.on('chat:message', onChat);
    socket.on('room:users', onUsers);

    return () => {
      socket.off('connect', onConnect);
      socket.off('chat:message', onChat);
      socket.off('room:users', onUsers);
    };
  }, [socket, code, name]);

  const send = (text) => {
    if (!socket) return;
    socket.emit('chat:message', { code, senderName: name, text });
  };

  return (
    <aside style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: 8, height: '100%' }}>
      <ChatUsers users={users} currentId={socketId} />
      <div style={{ minHeight: 0 }}>
        <MessageList messages={messages} currentId={socketId} currentName={name} />
      </div>
      <ChatInput onSend={send} />
    </aside>
  );
}

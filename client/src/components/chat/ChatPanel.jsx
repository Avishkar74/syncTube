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
    <aside className="w-full h-full bg-gray-600 rounded sm:grid xl:grid-rows-[3fr,1fr] xl:grid-cols-[1fr] md:grid-cols-[3fr,1fr] md:grid-rows-[1fr] sm:grid-rows-[1fr] flex flex-col">
      <div className="w-full rounded-t bg-gray-600 flex flex-col justify-between gap-2 py-2">
        <div className="w-full xl:h-[60vh] h-[40vh] flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-2">
          <MessageList messages={messages} currentId={socketId} currentName={name} />
        </div>
        <div className="w-full px-2"><ChatInput onSend={send} /></div>
      </div>
      <ChatUsers users={users} currentId={socketId} />
    </aside>
  );
}

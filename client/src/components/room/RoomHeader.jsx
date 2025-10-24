import { useParams } from 'react-router-dom';
import useClipboard from '../../hooks/useClipboard';
import Button from '../ui/Button';

export default function RoomHeader() {
  const { id: code } = useParams();
  const { copy, copied } = useClipboard();

  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/room/${code}`
    : `/room/${code}`;

  const onCopy = () => copy(inviteUrl);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      marginBottom: 12,
      background: '#fafafa',
    }}>
      <div>
        <strong>Room code:</strong> <code>{code}</code>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ color: '#6b7280', fontSize: 12 }}>Share link:</span>
        <code style={{
          background: '#f3f4f6',
          padding: '4px 6px',
          borderRadius: 6,
          maxWidth: 300,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{inviteUrl}</code>
        <Button onClick={onCopy}>{copied ? 'Copied!' : 'Copy'}</Button>
      </div>
    </div>
  );
}

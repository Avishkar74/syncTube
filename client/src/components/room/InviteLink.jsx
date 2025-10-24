import Button from '../ui/Button';
import useClipboard from '../../hooks/useClipboard';

export default function InviteLink({ url }) {
  const { copy, copied } = useClipboard();
  const handleCopy = () => copy(url || window.location.href);
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <code style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{url || window.location.href}</code>
      <Button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</Button>
    </div>
  );
}

import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { apiGet } from '../../services/apiClient';

function extractVideoId(raw) {
  if (!raw) return '';
  const val = raw.trim();
  // If it already looks like a plain ID
  if (/^[a-zA-Z0-9_-]{6,}$/.test(val)) return val;
  try {
    const url = new URL(val);
    // https://www.youtube.com/watch?v=VIDEO_ID
    const v = url.searchParams.get('v');
    if (v) return v;
    // youtu.be/VIDEO_ID
    const path = url.pathname.replace(/^\//, '');
    if (url.hostname.includes('youtu.be') && path) return path;
    // youtube.com/embed/VIDEO_ID
    if (url.pathname.startsWith('/embed/')) return url.pathname.split('/embed/')[1];
  } catch {
    // not a URL; fall through
  }
  return '';
}

// VideoIdInput: lets user paste a YouTube URL/ID and resolves metadata via backend
// Props: onSelect({ videoId, title, thumbnail })
export default function VideoIdInput({ onSelect }) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const id = extractVideoId(value);
    if (!id) return alert('Please enter a valid YouTube URL or Video ID');
    setLoading(true);
    try {
      const res = await apiGet(`/api/youtube/${id}`);
      const item = res?.data?.[0];
      if (!item) throw new Error('Video not found');
      onSelect?.(item);
    } catch {
      alert('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <label>Paste YouTube URL or Video ID</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <Button onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Load'}</Button>
      </div>
    </div>
  );
}

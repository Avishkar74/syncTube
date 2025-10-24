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

  // Best-effort metadata fetch with a short timeout, but emit the videoId immediately
  const load = async () => {
    const id = extractVideoId(value);
    if (!id) return alert('Please enter a valid YouTube URL or Video ID');
    console.log('[ui] load video', { raw: value, extractedId: id });

    // Immediately emit selection so the player loads even if metadata fetch fails (e.g., YouTube blocks scraping)
    onSelect?.({ videoId: id, title: '' });

    // Attempt to resolve proper title/thumbnail in background; if it works, emit again to update title
    setLoading(true);
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 4000); // 4s safeguard
      const res = await apiGet(`/api/youtube/${id}`, { signal: controller.signal });
      clearTimeout(t);
      const item = res?.data?.[0];
      console.log('[api] /api/youtube', { id, item });
      if (item) onSelect?.(item);
    } catch (err) {
      console.warn('[api] /api/youtube failed (non-blocking)', err?.message || err);
      // ignore failures; the immediate emit above already loaded the video
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

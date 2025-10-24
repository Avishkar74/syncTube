import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { apiGet } from '../../services/apiClient';

// VideoSearchResults: lets users search YouTube and pick a result
// Props: onSelect({ videoId, title, thumbnail }), defaultQuery?
export default function VideoSearchResults({ onSelect, defaultQuery = '' }) {
  const [q, setQ] = useState(defaultQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const search = async () => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiGet(`/api/youtube/search?q=${encodeURIComponent(q.trim())}`);
      setResults(res?.data || []);
    } catch {
      setResults([]);
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search YouTube videos" />
        <Button onClick={search} disabled={loading}>{loading ? 'Searching...' : 'Search'}</Button>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        {results.length === 0 && !loading ? (
          <p style={{ color: '#6b7280' }}>No results</p>
        ) : (
          results.map((v) => (
            <button
              key={v.videoId}
              onClick={() => onSelect?.(v)}
              style={{ display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, cursor: 'pointer' }}
            >
              <img src={v.thumbnail} alt={v.title} width={120} height={68} style={{ objectFit: 'cover', borderRadius: 6 }} />
              <div style={{ display: 'grid' }}>
                <strong style={{ color: '#111827' }}>{v.title}</strong>
                <span style={{ color: '#6b7280', fontSize: 12 }}>ID: {v.videoId}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

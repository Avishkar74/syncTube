import { useState } from 'react';
import VideoIdInput from '../video-id-input/VideoIdInput';
import VideoSearchResults from '../video-search-results/VideoSearchResults';

// VideoPicker: combines URL/ID input and search to select a video
// Props: onPick({ videoId, title, thumbnail })
export default function VideoPicker({ onPick }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (item) => {
    setSelected(item);
    onPick?.(item);
  };

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <VideoIdInput onSelect={handleSelect} />
      <div style={{ height: 1, background: '#e5e7eb' }} />
      <VideoSearchResults onSelect={handleSelect} />

      {selected && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
          <img src={selected.thumbnail} alt={selected.title} width={120} height={68} style={{ objectFit: 'cover', borderRadius: 6 }} />
          <div style={{ display: 'grid' }}>
            <strong style={{ color: '#111827' }}>{selected.title}</strong>
            <span style={{ color: '#6b7280', fontSize: 12 }}>ID: {selected.videoId}</span>
          </div>
        </div>
      )}
    </section>
  );
}

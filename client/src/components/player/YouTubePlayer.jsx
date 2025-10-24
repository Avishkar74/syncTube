import { useState } from 'react';

export default function YouTubePlayer() {
  const [videoId] = useState('dQw4w9WgXcQ');
  const src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
  return (
    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
      <iframe
        title="YouTube Player"
        src={src}
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
      />
    </div>
  );
}

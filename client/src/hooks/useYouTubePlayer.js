import { useRef } from 'react';

export default function useYouTubePlayer() {
  const apiRef = useRef(null);
  return {
    api: apiRef.current,
    play: () => {},
    pause: () => {},
    seekTo: () => {}
  };
}

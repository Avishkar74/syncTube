import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import useSocket from '../../hooks/useSocket';
import { apiGet } from '../../services/apiClient';
import VideoPicker from './VideoPicker';

export default function YouTubePlayer() {
  const { id: code } = useParams();
  const socket = useSocket();
  // Name is available from localStorage if needed for future features
  useMemo(() => localStorage.getItem('syncTube:name') || 'Guest', []);

  const playerRef = useRef(null);
  const suppressRef = useRef(false); // avoid echo when applying remote updates

  const [video, setVideo] = useState({ videoId: null, title: '' });

  // Load initial room state
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiGet(`/api/rooms/${code}`);
        const v = res?.room?.currentVideo;
        if (active && v?.videoId) {
          setVideo({ videoId: v.videoId, title: v.title || '' });
          // If player ready, cue and optionally seek
          if (playerRef.current) {
            suppressRef.current = true;
            playerRef.current.cueVideoById(v.videoId, Math.floor(v.positionSeconds || 0));
            if (v.isPlaying) playerRef.current.playVideo();
            suppressRef.current = false;
          }
        }
      } catch {
        // ignore
      }
    })();
    return () => { active = false; };
  }, [code]);

  // Socket listeners for player sync
  useEffect(() => {
    if (!socket) return;

    const onVideo = ({ videoId, title }) => {
      setVideo({ videoId, title: title || '' });
      if (playerRef.current && videoId) {
        suppressRef.current = true;
        playerRef.current.cueVideoById(videoId, 0);
        suppressRef.current = false;
      }
    };
    const onPlay = ({ positionSeconds = 0 }) => {
      if (!playerRef.current) return;
      suppressRef.current = true;
      playerRef.current.seekTo(positionSeconds, true);
      playerRef.current.playVideo();
      suppressRef.current = false;
    };
    const onPause = ({ positionSeconds = 0 }) => {
      if (!playerRef.current) return;
      suppressRef.current = true;
      playerRef.current.seekTo(positionSeconds, true);
      playerRef.current.pauseVideo();
      suppressRef.current = false;
    };
    const onSeek = ({ positionSeconds = 0 }) => {
      if (!playerRef.current) return;
      suppressRef.current = true;
      playerRef.current.seekTo(positionSeconds, true);
      suppressRef.current = false;
    };

    socket.on('player:video', onVideo);
    socket.on('player:play', onPlay);
    socket.on('player:pause', onPause);
    socket.on('player:seek', onSeek);

    return () => {
      socket.off('player:video', onVideo);
      socket.off('player:play', onPlay);
      socket.off('player:pause', onPause);
      socket.off('player:seek', onSeek);
    };
  }, [socket]);

  const opts = {
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
    },
  };

  const onReady = (e) => {
    playerRef.current = e.target;
    // If we already have a video id, cue it now
    if (video.videoId) {
      suppressRef.current = true;
      playerRef.current.cueVideoById(video.videoId, 0);
      suppressRef.current = false;
    }
  };

  const emitWithPos = (eventName) => {
    if (!socket || !playerRef.current) return;
    if (suppressRef.current) return;
    const positionSeconds = Math.floor(playerRef.current.getCurrentTime?.() || 0);
    socket.emit(eventName, { code, positionSeconds });
  };

  const onPlay = () => emitWithPos('player:play');
  const onPause = () => emitWithPos('player:pause');

  // Debounced seek: listen to state changes where user scrubs (buffering)
  // For simplicity, call seek emit on end of buffering or on pause/play triggers
  const onStateChange = (e) => {
    // 3 = buffering; 1 = playing; 2 = paused
    const state = e?.data;
    if (state === 3) {
      // user likely scrubbing; emit seek with current position
      emitWithPos('player:seek');
    }
  };

  const pickVideo = (item) => {
    setVideo({ videoId: item.videoId, title: item.title });
    if (socket) {
      socket.emit('player:set-video', { code, videoId: item.videoId, title: item.title });
    }
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ position: 'relative', paddingTop: '56.25%' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <YouTube
            videoId={video.videoId || undefined}
            opts={opts}
            onReady={onReady}
            onPlay={onPlay}
            onPause={onPause}
            onStateChange={onStateChange}
          />
        </div>
      </div>

      <VideoPicker onPick={pickVideo} />
    </div>
  );
}

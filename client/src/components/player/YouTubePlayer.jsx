import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import useSocket from '../../hooks/useSocket';
import { apiGet } from '../../services/apiClient';
// Video selection is handled from the header search; this component only renders the player.

export default function YouTubePlayer() {
  const { id: code } = useParams();
  const socket = useSocket();
  // Name is available from localStorage if needed for future features
  useMemo(() => localStorage.getItem('syncTube:name') || 'Guest', []);

  const playerRef = useRef(null);
  const suppressRef = useRef(false); // avoid echo when applying remote updates
  const suppressTimer = useRef(null);

  const [video, setVideo] = useState({ videoId: null, title: '' });
  
  // Try to start playback at the specified time; if autoplay is blocked, retry muted
  const ensurePlayAt = (pos, serverTime) => {
    const p = playerRef.current;
    if (!p) return;
    const drift = serverTime ? (Date.now() - serverTime) / 1000 : 0;
    const target = Math.max(0, Math.floor((pos || 0) + drift));
    p.seekTo(target, true);
    p.playVideo();
    // If browser blocks autoplay with sound, retry muted
    setTimeout(() => {
      const state = p.getPlayerState ? p.getPlayerState() : null;
      if (state !== 1) {
        p.mute?.();
        p.playVideo();
      }
    }, 150);
  };

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

    const onVideo = ({ videoId, title, positionSeconds, isPlaying, serverTime }) => {
      console.log('[socket] player:video <-', { videoId, title, positionSeconds, isPlaying, serverTime });
      setVideo({ videoId, title: title || '' });
      if (playerRef.current && videoId) {
        suppressRef.current = true;
        const pos = Math.floor(positionSeconds || 0);
        playerRef.current.cueVideoById(videoId, pos);
        if (isPlaying) {
          // try to start; if blocked by autoplay policy, retry muted below
          ensurePlayAt(pos, serverTime);
        }
        clearTimeout(suppressTimer.current);
        suppressTimer.current = setTimeout(() => {
          suppressRef.current = false;
        }, 500);
      }
    };
    const onPlay = ({ positionSeconds = 0, serverTime }) => {
      console.log('[socket] player:play <-', { positionSeconds, serverTime });
      if (!playerRef.current) return;
      suppressRef.current = true;
      ensurePlayAt(positionSeconds, serverTime);
      clearTimeout(suppressTimer.current);
      suppressTimer.current = setTimeout(() => {
        suppressRef.current = false;
      }, 600);
    };
    const onPause = ({ positionSeconds = 0 }) => {
      console.log('[socket] player:pause <-', { positionSeconds });
      if (!playerRef.current) return;
      suppressRef.current = true;
      playerRef.current.seekTo(positionSeconds, true);
      playerRef.current.pauseVideo();
      clearTimeout(suppressTimer.current);
      suppressTimer.current = setTimeout(() => {
        suppressRef.current = false;
      }, 400);
    };
    const onSeek = ({ positionSeconds = 0 }) => {
      console.log('[socket] player:seek <-', { positionSeconds });
      if (!playerRef.current) return;
      suppressRef.current = true;
      playerRef.current.seekTo(positionSeconds, true);
      clearTimeout(suppressTimer.current);
      suppressTimer.current = setTimeout(() => {
        suppressRef.current = false;
      }, 300);
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
      playsinline: 1,
    },
  };

  const onReady = (e) => {
    playerRef.current = e.target;
    console.log('[yt] onReady');
    // Intentionally do not auto-cue here; we rely on room snapshot/socket events
  };

  const emitWithPos = (eventName) => {
    if (!socket || !playerRef.current) return;
    if (suppressRef.current) return;
    const positionSeconds = Math.floor(playerRef.current.getCurrentTime?.() || 0);
    console.log('[socket] emit ->', eventName, { positionSeconds });
    socket.emit(eventName, { code, positionSeconds });
  };

  const onPlay = () => emitWithPos('player:play');
  const onPause = () => emitWithPos('player:pause');

  // Debounced seek: listen to state changes where user scrubs (buffering)
  // For simplicity, call seek emit on end of buffering or on pause/play triggers
  const onStateChange = (e) => {
    // 3 = buffering; 1 = playing; 2 = paused
    const state = e?.data;
    console.log('[yt] onStateChange', state);
    if (state === 3) {
      // user likely scrubbing; emit seek with current position
      emitWithPos('player:seek');
    }
  };

  // Selecting a video is done via header search which emits 'player:set-video'

  return (
    <div className="w-full h-full bg-[#282828] rounded overflow-hidden">
      <div className="relative pt-[56.25%]">
        <div className="absolute inset-0">
          {video.videoId ? (
            <YouTube
              videoId={video.videoId || undefined}
              opts={opts}
              onReady={onReady}
              onPlay={onPlay}
              onPause={onPause}
              onStateChange={onStateChange}
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center font-mono"><span className="text-white text-4xl">NO VIDEO</span></div>
          )}
        </div>
      </div>
    </div>
  );
}

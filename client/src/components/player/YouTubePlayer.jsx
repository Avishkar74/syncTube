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
  const readyRef = useRef(false);
  const suppressRef = useRef(false); // avoid echo when applying remote updates
  const suppressTimer = useRef(null);
  const clockOffsetRef = useRef(0); // serverTime ~ Date.now() + offset
  const lastSyncRef = useRef(null); // { positionSeconds, serverTime, isPlaying }
  const playingRef = useRef(false);

  const [video, setVideo] = useState({ videoId: null, title: '' });
  
  // Try to start playback at the specified time; if autoplay is blocked, retry muted
  const ensurePlayAt = (pos, serverTime) => {
    const p = playerRef.current;
    if (!p) return;
    const nowAdj = Date.now() + (clockOffsetRef.current || 0);
    const drift = serverTime ? (nowAdj - serverTime) / 1000 : 0;
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
          if (playerRef.current && readyRef.current) {
            suppressRef.current = true;
            playerRef.current.cueVideoById(v.videoId, Math.floor(v.positionSeconds || 0));
            if (v.isPlaying) playerRef.current.playVideo();
            suppressRef.current = false;
          }
          lastSyncRef.current = { positionSeconds: Math.floor(v.positionSeconds || 0), serverTime: Date.now(), isPlaying: !!v.isPlaying };
          playingRef.current = !!v.isPlaying;
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
      if (playerRef.current && readyRef.current && videoId) {
        try {
          suppressRef.current = true;
          const pos = Math.floor(positionSeconds || 0);
          playerRef.current.cueVideoById(videoId, pos);
          if (isPlaying) {
            // try to start; if blocked by autoplay policy, retry muted below
            ensurePlayAt(pos, serverTime);
          }
        } catch (e) {
          console.warn('[yt] cueVideoById deferred', e?.message || e);
          setTimeout(() => {
            try {
              if (!playerRef.current) return;
              const pos2 = Math.floor(positionSeconds || 0);
              playerRef.current.cueVideoById(videoId, pos2);
              if (isPlaying) ensurePlayAt(pos2, serverTime);
            } catch (err2) {
              console.warn('[yt] cue retry failed', err2?.message || err2);
            }
          }, 150);
        } finally {
          clearTimeout(suppressTimer.current);
          suppressTimer.current = setTimeout(() => {
            suppressRef.current = false;
          }, 500);
        }
      }
      lastSyncRef.current = { positionSeconds: Math.floor(positionSeconds || 0), serverTime, isPlaying: !!isPlaying };
      playingRef.current = !!isPlaying;
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
      lastSyncRef.current = { positionSeconds: Math.floor(positionSeconds || 0), serverTime, isPlaying: true };
      playingRef.current = true;
    };
    const onPause = ({ positionSeconds = 0, serverTime }) => {
      console.log('[socket] player:pause <-', { positionSeconds, serverTime });
      if (!playerRef.current) return;
      suppressRef.current = true;
      playerRef.current.seekTo(positionSeconds, true);
      playerRef.current.pauseVideo();
      clearTimeout(suppressTimer.current);
      suppressTimer.current = setTimeout(() => {
        suppressRef.current = false;
      }, 400);
      lastSyncRef.current = { positionSeconds: Math.floor(positionSeconds || 0), serverTime, isPlaying: false };
      playingRef.current = false;
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
      const currentSync = lastSyncRef.current || { serverTime: Date.now(), isPlaying: playingRef.current };
      lastSyncRef.current = { positionSeconds: Math.floor(positionSeconds || 0), serverTime: currentSync.serverTime, isPlaying: currentSync.isPlaying };
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
    // Make iframe fill its container; container is absolute inset-0 with a 16:9 wrapper
    width: '100%',
    height: '100%',
  };

  const onReady = (e) => {
    playerRef.current = e.target;
    console.log('[yt] onReady');
    readyRef.current = true;
    // Apply any last known snapshot once ready
    const snap = lastSyncRef.current;
    if (snap && video.videoId) {
      try {
        suppressRef.current = true;
        playerRef.current.cueVideoById(video.videoId, Math.floor(snap.positionSeconds || 0));
        if (snap.isPlaying) ensurePlayAt(Math.floor(snap.positionSeconds || 0), snap.serverTime);
      } catch (err) {
        console.warn('[yt] onReady apply snapshot failed; retrying', err?.message || err);
        setTimeout(() => {
          try {
            if (!playerRef.current) return;
            playerRef.current.cueVideoById(video.videoId, Math.floor(snap.positionSeconds || 0));
            if (snap.isPlaying) ensurePlayAt(Math.floor(snap.positionSeconds || 0), snap.serverTime);
          } catch (err2) {
            console.warn('[yt] onReady retry failed', err2?.message || err2);
          }
        }, 120);
      } finally {
        clearTimeout(suppressTimer.current);
        suppressTimer.current = setTimeout(() => { suppressRef.current = false; }, 400);
      }
    }
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

  // Clock sync via time:ping/pong to estimate server-client offset
  useEffect(() => {
    if (!socket) return;
    let cancelled = false;
    const samples = [];
    const takeSample = () => new Promise((resolve) => {
      const t0 = Date.now();
      const handler = (payload) => {
        const t3 = Date.now();
        const t2 = payload?.serverTime || t3;
        const rtt = t3 - t0;
        const offset = t2 - (t0 + rtt / 2);
        samples.push({ rtt, offset });
        socket.off('time:pong', handler);
        resolve();
      };
      socket.on('time:pong', handler);
      socket.emit('time:ping', { t0 });
    });
    (async () => {
      for (let i = 0; i < 3; i++) {
        await takeSample();
        await new Promise((r) => setTimeout(r, 120));
      }
      if (cancelled) return;
      // pick the sample with the smallest RTT
      samples.sort((a, b) => a.rtt - b.rtt);
      const best = samples[0];
      clockOffsetRef.current = best ? best.offset : 0;
      console.log('[time] offset(ms)=', Math.round(clockOffsetRef.current));
    })();
    return () => { cancelled = true; };
  }, [socket]);

  // Periodic drift correction while playing
  useEffect(() => {
    const id = setInterval(() => {
      const p = playerRef.current;
      const sync = lastSyncRef.current;
      if (!p || !sync || !playingRef.current) return;
      const nowAdj = Date.now() + (clockOffsetRef.current || 0);
      const expected = (sync.positionSeconds || 0) + ((nowAdj - (sync.serverTime || nowAdj)) / 1000);
      const actual = p.getCurrentTime ? p.getCurrentTime() : 0;
      const delta = (actual || 0) - expected;
      if (Math.abs(delta) > 0.25) {
        // correct aggressively if > 250ms off
        suppressRef.current = true;
        p.seekTo(Math.max(0, expected), true);
        clearTimeout(suppressTimer.current);
        suppressTimer.current = setTimeout(() => { suppressRef.current = false; }, 300);
        console.log('[sync] corrected drift', { delta: Math.round(delta * 1000) / 1000 });
      } else if (Math.abs(delta) > 0.08) {
        // small nudge if between 80–250ms
        suppressRef.current = true;
        p.seekTo(Math.max(0, expected), true);
        clearTimeout(suppressTimer.current);
        suppressTimer.current = setTimeout(() => { suppressRef.current = false; }, 200);
      }
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // Resync on reconnect
  useEffect(() => {
    if (!socket) return;
    const onReconnect = () => socket.emit('player:resync', { code });
    socket.io.on('reconnect', onReconnect);
    return () => socket.io.off('reconnect', onReconnect);
  }, [socket, code]);

  // Selecting a video is done via header search which emits 'player:set-video'

  return (
    <div className="w-full h-full bg-[#282828] rounded overflow-hidden">
      <div className="relative pt-[56.25%]">
        <div className="absolute inset-0">
          {video.videoId ? (
            <YouTube
              videoId={video.videoId || undefined}
              opts={opts}
              className="w-full h-full"
              iframeClassName="w-full h-full"
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

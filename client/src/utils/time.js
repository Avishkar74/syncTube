export function formatDuration(seconds) {
  seconds = Math.max(0, Math.floor(seconds || 0));
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

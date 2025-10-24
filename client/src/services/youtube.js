const YT_API_KEY = import.meta.env.VITE_YT_API_KEY;
const YT_API = 'https://www.googleapis.com/youtube/v3';

export async function searchVideos(q, maxResults = 5) {
  const params = new URLSearchParams({ part: 'snippet', q, maxResults, key: YT_API_KEY });
  const res = await fetch(`${YT_API}/search?${params.toString()}`);
  if (!res.ok) throw new Error('YouTube search failed');
  const data = await res.json();
  return data.items || [];
}

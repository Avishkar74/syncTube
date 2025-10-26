# syncTube – Client (React + Vite)

Frontend for synchronized YouTube watch rooms with realtime chat.

Live: <https://synctubeee.netlify.app/>

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview build locally

## Environment variables

Copy `.env.example` to `.env` and adjust:

- `VITE_API_BASE_URL` — server base URL (e.g., <http://localhost:3001> or <https://synctube-8veb.onrender.com>)
- `VITE_SOCKET_URL` — Socket.IO base URL (same as server base URL)
- `VITE_SOCKET_TRANSPORTS` — optional, default `polling,websocket`. In production behind some proxies use `polling`.
- `VITE_SOCKET_UPGRADE` — optional, default `true`. Set `false` if you force polling-only.
- `VITE_YT_API_KEY` — optional if you use server-proxied metadata; used only for enhanced search features.

No trailing slashes in URLs.

## Local development

```powershell
npm install
npm run dev
```

Open <http://localhost:5173>.

## Deploy to Netlify

- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`
- Set the same environment variables as above in Netlify site settings.

## Usage (end users)

1. Create a room, copy the code.
2. Share the code link with friends.
3. Paste a YouTube link or search and select a video.
4. Play/pause/seek stays synchronized for everyone; chat updates in realtime.

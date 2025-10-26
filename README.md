# syncTube — Watch YouTube together in sync

Live demo: <https://synctubeee.netlify.app/>

syncTube lets you create a room, paste a YouTube link, and watch together with friends in perfect sync while chatting in real time. It’s a lightweight, modern stack with a small, maintainable codebase.

## What’s inside

- client/ — React 19 + Vite + TailwindCSS UI
- server/ — Express 5 REST API + Socket.IO 4 for realtime sync
- MongoDB + Mongoose — rooms, messages, and participants
- Deploy: Netlify (client) + Render (server)

## Features

- Create/join rooms with a short code
- Synchronized play/pause/seek and now-playing video
- Realtime chat and participant list
- Resync-on-reconnect and drift correction
- Mobile-friendly layout

## Tech stack

- Frontend: React 19, Vite 7, TailwindCSS, React Router, react-youtube, socket.io-client
- Backend: Node.js, Express, Socket.IO, Mongoose, MongoDB Atlas
- Infra: Netlify (static client), Render (Node service)

## How it works (high level)

- Client sends player actions (play, pause, seek, set-video) via Socket.IO.
- Server timestamps events with its clock; clients compute a small clock offset via ping/pong and apply drift correction.
- New joiners receive the current video and position snapshot and start at the right time.

## Getting started (local)

1) Clone and install

```powershell
# from repo root
cd client; npm install; cd ..
cd server/src; npm install; cd ../..
```

2) Configure env vars

- Copy `client/.env.example` to `client/.env` and set values
- Copy `server/.env.example` to `server/src/.env` and set values

3) Run both apps

```powershell
# terminal 1 (client)
cd client; npm run dev

# terminal 2 (server)
cd server/src; npm run start
```

Client dev server runs on http://localhost:5173 and proxies API/socket to http://localhost:3001 when configured.

## Deploy

### Netlify (client)

- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`
- Env vars:
	- `VITE_API_BASE_URL` = <https://synctube-8veb.onrender.com>
	- `VITE_SOCKET_URL` = <https://synctube-8veb.onrender.com>
	- `VITE_SOCKET_TRANSPORTS` = `polling` (recommended for Render)
	- `VITE_SOCKET_UPGRADE` = `false`

Note: do not include trailing slashes in the URLs.

### Render (server)

- Use Node service, auto-start `node server.js` from `server/src/` (already configured)
- Important env vars (see `server/src/.env.example`):
	- `MONGODB_URI`, `PORT=10000` (Render assigns), `CLIENT_ORIGINS` (comma-separated origins: localhost:5173, Netlify URL, Render URL)
- Socket path is `/socket.io` with CORS enabled for the same origins.
- Logs include detailed handshake errors to help diagnose any connect issues.

## API quick reference

- `GET /api/health`
- `POST /api/rooms` — create room
- `GET /api/rooms/:code` — get room
- `POST /api/rooms/:code/messages` — post chat message
- `GET /api/youtube?id=:videoId` — fetch basic YouTube metadata (no private keys exposed client-side)

## Troubleshooting

- Socket connects locally but not in prod: force polling by setting `VITE_SOCKET_TRANSPORTS=polling` and `VITE_SOCKET_UPGRADE=false` on the client. Ensure server CORS `CLIENT_ORIGINS` includes your Netlify and Render URLs.
- 404s like `//api/...`: remove trailing slashes from `VITE_API_BASE_URL` and `VITE_SOCKET_URL`.
- YouTube not playing: if you see error code 101/150 in console, the video disallows embedding—try another video.

## Contributing

PRs are welcome. Keep changes small, add/adjust tests where applicable, and prefer minimal dependencies.

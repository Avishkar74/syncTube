# syncTube — Server (Express + Socket.IO)

HTTP API and Socket.IO server powering synchronized playback, chat, and room state.

## Scripts

- `npm run start` — run server (production mode)
- `npm run dev` — run with nodemon (if added locally)

Start from `server/src` directory; entry is `server.js`.

## Environment variables

Copy `.env.example` to `.env` in `server/src/` and set:

- `NODE_ENV=production` (or development)
- `PORT=3001` (Render assigns a port automatically; locally use 3001)
- `MONGODB_URI=mongodb+srv://...` — MongoDB Atlas connection string
- `CLIENT_ORIGINS=http://localhost:5173,https://synctubeee.netlify.app,https://synctube-8veb.onrender.com` — comma-separated list of allowed origins for REST + Socket.IO

Notes

- Socket.IO path is `/socket.io`.
- CORS for sockets and REST is restricted to `CLIENT_ORIGINS`.
- The server logs detailed Engine.IO `connection_error` events to help diagnose handshake failures.

## REST endpoints

- `GET /api/health`
- `POST /api/rooms`
- `GET /api/rooms/:code`
- `POST /api/rooms/:code/messages`
- `GET /api/youtube?id=:videoId`

## Deploy to Render

- Service type: Web Service (Node)
- Start command from `server/src`: `node server.js`
- Add the env vars listed above. Render will set `PORT`; do not hardcode.
- Ensure your Netlify site URL and this Render URL are present in `CLIENT_ORIGINS`.

## Troubleshooting

- If the client shows `connect_error server error`, force polling on the client (`VITE_SOCKET_TRANSPORTS=polling`, `VITE_SOCKET_UPGRADE=false`) and check server logs for `connection_error` details.

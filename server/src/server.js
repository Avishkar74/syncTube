// Entry point: create HTTP server, attach Socket.IO, connect DB, and start listening
const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const { createApp } = require('./app');
const { connectDB, disconnectDB } = require('./config/db');
const { registerSockets } = require('./sockets');
const env = require('./config/env');

dotenv.config();

const PORT = env.PORT || 3001;
const SOCKET_ORIGINS = env.CLIENT_ORIGINS && env.CLIENT_ORIGINS.length > 0 ? env.CLIENT_ORIGINS : (env.CLIENT_ORIGIN ? [env.CLIENT_ORIGIN] : ['*']);

async function start() {
	try {
		await connectDB();

		const app = createApp();
		const server = http.createServer(app);

			const io = new Server(server, {
				cors: {
					origin: SOCKET_ORIGINS,
					methods: ['GET', 'POST', 'OPTIONS'],
					credentials: true,
				},
			});

		registerSockets(io);

		// Surface useful diagnostics when the Engine.IO handshake fails
		io.engine.on('connection_error', (err) => {
			// eslint-disable-next-line no-console
			console.error('[socket] connection_error', {
				code: err.code,
				message: err.message,
				context: {
					transport: err.context && err.context.transport,
					origin: err.context && err.context.headers && err.context.headers.origin,
					referer: err.context && err.context.headers && err.context.headers.referer,
				},
			});
		});

		server.listen(PORT, () => {
			// eslint-disable-next-line no-console
			console.log(`HTTP + Socket.IO server listening on port ${PORT}`);
		});

		// graceful shutdown
		const shutdown = async () => {
			// eslint-disable-next-line no-console
			console.log('Shutting down server...');
			io.close();
			server.close(async () => {
				await disconnectDB();
				process.exit(0);
			});
		};

		process.on('SIGINT', shutdown);
		process.on('SIGTERM', shutdown);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('Failed to start server:', err);
		process.exit(1);
	}
}

start();


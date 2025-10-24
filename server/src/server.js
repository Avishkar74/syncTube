// Entry point: create HTTP server, attach Socket.IO, connect DB, and start listening
const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const { createApp } = require('./app');
const { connectDB, disconnectDB } = require('./config/db');
const { registerSockets } = require('./sockets');

dotenv.config();

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

async function start() {
	try {
		await connectDB();

		const app = createApp();
		const server = http.createServer(app);

		const io = new Server(server, {
			cors: {
				origin: CLIENT_ORIGIN,
				methods: ['GET', 'POST'],
				credentials: true,
			},
		});

		registerSockets(io);

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


const express = require('express');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('./config/db');
const apiRoutes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Built-in middlewares
app.use(express.json());
// Also accept URL-encoded form bodies (e.g., application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', apiRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);


async function start() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await disconnectDB();
    process.exit(0);
});

start();
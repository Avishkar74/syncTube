// MongoDB connection helper using Mongoose
const mongoose = require('mongoose');

let isConnected = false;

async function tryConnect(uri) {
  // Fail faster in dev when URI is unreachable (e.g., Atlas IP not whitelisted)
  const opts = { serverSelectionTimeoutMS: 5000 };
  await mongoose.connect(uri, opts);
}

async function connectDB() {
  if (isConnected) return mongoose.connection;

  // Recommended setting to silence strictQuery deprecation warnings
  mongoose.set('strictQuery', false);

  mongoose.connection.on('connected', () => {
    isConnected = true;
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  });
  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', err);
  });
  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    // eslint-disable-next-line no-console
    console.warn('MongoDB disconnected');
  });

  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/synctube';
  const shouldFallbackLocal = (process.env.MONGO_FALLBACK_LOCAL || 'true') === 'true';
  const localUri = 'mongodb://127.0.0.1:27017/synctube';

  try {
    // eslint-disable-next-line no-console
    console.log('[db] Connecting to', primaryUri.includes('mongodb.net') ? 'Atlas URI' : primaryUri);
    await tryConnect(primaryUri);
    return mongoose.connection;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[db] Primary MongoDB connection failed:', err?.message || err);
    const isAtlas = /mongodb\.net/i.test(primaryUri);
    if (shouldFallbackLocal && isAtlas) {
      // eslint-disable-next-line no-console
      console.warn('[db] Falling back to local MongoDB at', localUri, '(start Mongo locally or update MONGO_URI/.env)');
      await tryConnect(localUri);
      return mongoose.connection;
    }
    throw err;
  }
}

async function disconnectDB() {
  if (!isConnected) return;
  await mongoose.connection.close();
  isConnected = false;
}

module.exports = { connectDB, disconnectDB };

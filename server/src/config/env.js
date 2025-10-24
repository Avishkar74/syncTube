// Environment configuration helper
// Optionally load dotenv if available
try { require('dotenv').config(); } catch (_) {}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3001,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/synctube',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'change_me'
};

module.exports = env;

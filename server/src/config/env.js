// Environment configuration helper
// Optionally load dotenv if available
try { require('dotenv').config(); } catch (_) {}

// Support multiple allowed client origins via comma-separated list
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS
  || process.env.CLIENT_ORIGIN
  || 'http://localhost:5173,https://synctubee.netlify.app')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3001,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/synctube',
  CLIENT_ORIGIN: CLIENT_ORIGINS[0],
  CLIENT_ORIGINS,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'change_me'
};

module.exports = env;

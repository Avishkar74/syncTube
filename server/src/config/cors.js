// CORS options factory
const env = require('./env');

function getCorsOptions() {
  return {
    origin: env.CLIENT_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
}

module.exports = { getCorsOptions };

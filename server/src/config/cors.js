// CORS options factory
const env = require('./env');

function getCorsOptions() {
  const origins = env.CLIENT_ORIGINS && env.CLIENT_ORIGINS.length > 0 ? env.CLIENT_ORIGINS : [env.CLIENT_ORIGIN];
  return {
    // cors package accepts an array for multiple allowed origins
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
}

module.exports = { getCorsOptions };

// Minimal request logger middleware (placeholder)
function logger(req, _res, next) {
  /* eslint-disable no-console */
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = { logger };

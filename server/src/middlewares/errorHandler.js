// Centralized error handler (placeholder)
module.exports = function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  // Helpful server-side log for debugging
  try {
    console.error('[error]', req.method, req.originalUrl, status, err && err.stack ? err.stack : err);
  } catch {}
  res.status(status).json({ message: err && err.message ? err.message : 'Internal Server Error' });
};

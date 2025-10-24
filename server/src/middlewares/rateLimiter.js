// Simple in-memory rate limiter placeholder
const buckets = new Map();
module.exports = function rateLimiter(windowMs = 1000, max = 20) {
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    const hist = buckets.get(key) || [];
    const fresh = hist.filter((t) => now - t < windowMs);
    fresh.push(now);
    buckets.set(key, fresh);
    if (fresh.length > max) return res.status(429).json({ message: 'Too Many Requests' });
    next();
  };
};

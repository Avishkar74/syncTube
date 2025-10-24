// Auth middleware (placeholder)
module.exports = function auth(req, _res, next) {
  req.user = { id: 'demo' };
  next();
};

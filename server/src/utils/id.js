// Simple id helper
module.exports = function id(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
};

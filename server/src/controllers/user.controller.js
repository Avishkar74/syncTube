// User controller (placeholder)
const userService = require('../services/user.service');

exports.me = async (req, res) => {
  const user = await userService.getMe(req.user?.id);
  res.json(user || {});
};

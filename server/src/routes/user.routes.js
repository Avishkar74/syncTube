const express = require('express');
const ctrl = require('../controllers/user.controller');

const router = express.Router();
router.get('/me', ctrl.me);

module.exports = router;

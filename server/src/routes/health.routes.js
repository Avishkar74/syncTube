const express = require('express');
const ctrl = require('../controllers/health.controller');

const router = express.Router();
router.get('/', ctrl.health);

module.exports = router;

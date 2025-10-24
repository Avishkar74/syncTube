const express = require('express');
const ctrl = require('../controllers/message.controller');

const router = express.Router({ mergeParams: true });

// Mounted at /rooms/:code/messages
router.get('/', ctrl.list);
router.post('/', ctrl.create);

module.exports = router;

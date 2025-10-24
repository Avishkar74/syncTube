const express = require('express');
const ctrl = require('../controllers/message.controller');

const router = express.Router({ mergeParams: true });
router.get('/:roomId', ctrl.list);
router.post('/:roomId', ctrl.create);

module.exports = router;

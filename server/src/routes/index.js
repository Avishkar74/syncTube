const express = require('express');
const health = require('./health.routes');
const rooms = require('./room.routes');
const users = require('./user.routes');
const youtube = require('./youtube.routes');

const router = express.Router();

router.use('/health', health);
router.use('/rooms', rooms);
router.use('/users', users);
// Nested messages under rooms by code
router.use('/rooms/:code/messages', require('./message.routes'));
router.use('/youtube', youtube);

module.exports = router;

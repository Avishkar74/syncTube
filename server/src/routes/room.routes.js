const express = require('express');
const ctrl = require('../controllers/room.controller');

const router = express.Router();

// Create room
router.post('/', ctrl.createRoom);

// Get room by code
router.get('/:code', ctrl.getRoom);

// End room (mark inactive)
router.post('/:code/end', ctrl.endRoom);

module.exports = router;

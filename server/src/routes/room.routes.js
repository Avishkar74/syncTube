const express = require('express');
const ctrl = require('../controllers/room.controller');

const router = express.Router();
router.post('/', ctrl.createRoom);
router.get('/:id', ctrl.getRoom);

module.exports = router;

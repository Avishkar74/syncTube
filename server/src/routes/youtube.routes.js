const express = require('express');
const yt = require('../services/youtube.service');

const router = express.Router();
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const data = await yt.search(q);
  res.json(data);
});

module.exports = router;

const express = require('express');
const yt = require('../services/youtube.service');

const router = express.Router();

// IMPORTANT: keep /search before /:videoId to avoid route conflicts
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const data = await yt.search(q);
  res.status(data.status === 'ok' ? 200 : 500).json(data);
});

router.get('/:videoId', async (req, res) => {
  const { videoId } = req.params;
  const data = await yt.getById(videoId);
  const ok = data.status === 'ok';
  res.status(ok ? 200 : data.message === 'Video not found' ? 404 : 500).json(data);
});

module.exports = router;

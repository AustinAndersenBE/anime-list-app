const express = require('express');
const { getPostsByAnime, getPostsByUserId } = require('../controllers/postController');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');

// getting all posts for a specific anime
router.get('/anime/:animeApiId', authenticateJWT, async (req, res, next) => {
  try {
    const animeApiId = req.params.animeApiId;
    const posts = await getPostsByAnime(animeApiId);
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// getting all posts for a specific user
router.get('/user/:userId', authenticateJWT, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const posts = await getPostsByUserId(userId);
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

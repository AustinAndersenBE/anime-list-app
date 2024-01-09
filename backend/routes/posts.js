const express = require('express');
const { getPostsByAnime, getPostsByUserId } = require('../controllers/postController');
const router = express.Router();
const { authenticateJWT, ensureCorrectUserOrAdmin } = require('../middleware/auth');

// getting all posts for a specific anime
router.get('/anime/:animeId', authenticateJWT, ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const animeId = req.params.animeId;
    const posts = await getPostsByAnime(animeId);
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// getting all posts for a specific user
router.get('/user/:userId', authenticateJWT, ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const posts = await getPostsByUserId(userId);
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

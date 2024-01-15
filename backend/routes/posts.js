const express = require('express');
const { getPostsByAnime, getPostsByUserId } = require('../controllers/postController');
const router = express.Router();
const { authenticateJWT, ensureCorrectUserOrAdmin, ensureAuthenticated } = require('../middleware/auth');

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

// getting all posts for a specific user. maybe i should change name later
router.get('/user/:userId', authenticateJWT, ensureAuthenticated, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log('userId:', userId);  // Log the userId

    const posts = await getPostsByUserId(userId);
    console.log('posts:', posts);  // Log the posts

    res.json(posts);
  } catch (error) {
    console.error('Error in /user/:userId route:', error.message);  // Log the error message
    console.error(error.stack);  // Log the error stack trace
    next(error);
  }
});

module.exports = router;

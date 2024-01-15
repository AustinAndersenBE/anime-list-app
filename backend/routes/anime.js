const express = require('express');
const { searchAnime, getAnimeById, getAiringAnime } = require('../helpers/extAnimeAPI');
const router = express.Router();

// GET /anime/search/:query - Search for anime by name
router.get('/search/:query', async (req, res, next) => {
  try {
    const query = req.params.query;
    const anime = await searchAnime(query);
    res.json(anime);
  } catch (error) {
    next(error);
  }
});

// GET /anime/:id - Get anime by ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const anime = await getAnimeById(id);
    res.json(anime);
  } catch (error) {
    next(error);
  }
});

router.post('/airing', async (req, res, next) => {
  try {
    const { page, limit } = req.body;
    const airingAnime = await getAiringAnime(page, limit);
    res.json(airingAnime);
  } catch (error) {
    console.error('Error in /anime/airing POST route:', error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
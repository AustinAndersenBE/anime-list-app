const express = require('express');
const { searchAnime, getAnimeById } = require('../helpers/extAnimeAPI');
const router = express.Router();

router.get('/search/:query', async (req, res, next) => {
  try {
    const query = req.params.query;
    const anime = await searchAnime(query);
    res.json(anime);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const anime = await getAnimeById(id);
    res.json(anime);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { authenticateJWT, ensureCorrectUser, ensureAuthenticated } = require('../middleware/auth');

// POST users/favorites - Add an anime to favorites
router.post('/favorites', authenticateJWT, ensureCorrectUser, async (req, res, next) => {
  try {
    const { externalAnimeId, animeTitle } = req.body;
    const { id: userId } = req.user;

    const favorite = await prisma.userAnimeList.create({
      data: {
        userId: userId,
        externalAnimeId: externalAnimeId,
        animeTitle: animeTitle,
        status: 'WILL_WATCH',
      },
    });
    res.status(201).json(favorite);
  } catch (error) {
    console.log(req.body); // for debugging
    console.error(error); // for debugging
    next(error);
  }
});

// GET users/favorites - Get a user's favorites
router.get('/favorites', authenticateJWT, ensureAuthenticated, async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const favorites = await prisma.userAnimeList.findMany({
      where: {
        userId: Number(userId),
      },
    });
    res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
});

// DELETE users/favorites - Remove an anime from favorites
router.delete('/favorites/:animeId', authenticateJWT, ensureAuthenticated, async (req, res, next) => {
  try {
    const animeId = String(req.params.animeId);
    const { id: userId } = req.user;

    // Step 1: Find the record
    const userAnimeListRecord = await prisma.userAnimeList.findFirst({
      where: {
        userId: userId,
        externalAnimeId: animeId,
      },
    });

    if (!userAnimeListRecord) {
      return res.status(404).json({ message: 'Anime not found.' });
    }

    // Step 2: Delete the record using its primary key
    await prisma.userAnimeList.delete({
      where: {
        id: userAnimeListRecord.id,
      },
    });

    res.status(200).json({ message: 'Favorite removed.' });
  } catch (error) {
    console.error('Error deleting favorite:', error.message);
    console.error(error.stack);
    next(error);
  }
});


// GET users/favorites/:animeId - Check if an anime is a favorite
router.get('/favorites/:animeId', authenticateJWT, ensureCorrectUser, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { animeId } = req.params;

    const favorite = await prisma.userAnimeList.findUnique({
      where: { userId_externalAnimeId: { userId, externalAnimeId: animeId } },
    });
    res.status(200).json(Boolean(favorite));
  } catch (error) {
    next(error);
  }
});

// POST users/posts - Create a new post
router.post('/posts', authenticateJWT, ensureCorrectUser, async (req, res, next) => {
  try {
    const { externalAnimeId, title, content } = req.body;
    const { id: userId } = req.user;

    const newPost = await prisma.post.create({
      data: {
        userId: userId,
        externalAnimeId: externalAnimeId,
        title: title,
        content: content,
        createdDate: new Date(),
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;

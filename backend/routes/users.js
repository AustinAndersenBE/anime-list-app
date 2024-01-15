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
      orderBy: {
        rating: 'desc',
      },
    });
    res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
});

// POST users/favorites - Update multiple favorites' ratings
router.post('/favorites/update-rating', authenticateJWT, ensureCorrectUser, async (req, res, next) => {
  try {
    const { ratings } = req.body;
    const { id: userId } = req.user;

    const updatePromises = ratings.map(ratingUpdate => {
      return prisma.userAnimeList.update({
        where: {
          userId_externalAnimeId: {
            userId: userId,
            externalAnimeId: ratingUpdate.externalAnimeId
          }
        },
        data: {
          rating: ratingUpdate.rating
        }
      });
    });

    const updatedFavorites = await prisma.$transaction(updatePromises);
    res.json(updatedFavorites);
  } catch (error) {
    console.error('Error updating favorites:', error);
    next(error);
  }
});

// GET users/public-users/:userId/favorites - Get a specific user's public favorites
router.get('/public-users/:userId/favorites', authenticateJWT, ensureAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;

    const favorites = await prisma.userAnimeList.findMany({
      where: {
        userId: Number(userId),
      },
      orderBy: {
        rating: 'desc',
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

// POST users/follow - Follow a user by username
router.post('/follow', authenticateJWT, ensureCorrectUser, async (req, res, next) => {
  try {
    const { usernameToFollow } = req.body;
    const { id: followerId } = req.user;

    // Find the user to follow by username
    const userToFollow = await prisma.user.findUnique({
      where: {
        username: usernameToFollow,
      },
    });

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found." });
    }

    const followingId = userToFollow.id;

    // Prevent users from following themselves
    if (followerId === followingId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    // Check if the following relationship already exists
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

    if (existingFollow) {
      return res.status(400).json({ message: "You are already following this user." });
    }

    // Create a new follow relationship
    const follow = await prisma.userFollow.create({
      data: {
        followerId: followerId,
        followingId: followingId,
      },
    });

    res.status(201).json(follow);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// GET users/following - Get a list of users the current user is following
router.get('/following', authenticateJWT, ensureAuthenticated, async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const followingList = await prisma.userFollow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: true, // Include the details of the users being followed
      },
    });

    // followingList is an array of UserFollow objects so extracting it gives us an array of User objects
    const followingUsers = followingList.map(follow => follow.following);

    res.status(200).json(followingUsers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});



module.exports = router;

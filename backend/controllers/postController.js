const prisma = require('../prismaClient');

async function getPostsByAnime(animeApiId) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        animeApiId: animeApiId,
      },
      orderBy: {
        postDate: 'desc',
      },
    });
    return posts;
  } catch (error) {
    throw new Error(error);
  }
}

async function getPostsByUserId(userId) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        createdDate: 'desc',
      },
    });
    return posts;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getPostsByAnime,
  getPostsByUserId,
};
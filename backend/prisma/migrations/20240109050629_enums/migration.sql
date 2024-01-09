/*
  Warnings:

  - You are about to drop the column `animeApiId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `lastEdited` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postDate` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `animeApiId` on the `UserAnimeList` table. All the data in the column will be lost.
  - Added the required column `updatedDate` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalAnimeId` to the `UserAnimeList` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `UserAnimeList` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AnimeStatus" AS ENUM ('WATCHED', 'NOT_WATCHED', 'WILL_WATCH');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "animeApiId",
DROP COLUMN "lastEdited",
DROP COLUMN "postDate",
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "externalAnimeId" TEXT,
ADD COLUMN     "updatedDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserAnimeList" DROP COLUMN "animeApiId",
ADD COLUMN     "externalAnimeId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "AnimeStatus" NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

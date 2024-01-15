/*
  Warnings:

  - The primary key for the `UserAnimeList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserAnimeList` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `UserAnimeList` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(3,2)`.

*/
-- DropIndex
DROP INDEX "userId_externalAnimeId";

-- AlterTable
ALTER TABLE "UserAnimeList" DROP CONSTRAINT "UserAnimeList_pkey",
DROP COLUMN "id",
ALTER COLUMN "rating" SET DATA TYPE DECIMAL(3,2),
ADD CONSTRAINT "UserAnimeList_pkey" PRIMARY KEY ("userId", "externalAnimeId");

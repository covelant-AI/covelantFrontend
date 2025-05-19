/*
  Warnings:

  - You are about to drop the column `videoLocation` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "videoLocation",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT;

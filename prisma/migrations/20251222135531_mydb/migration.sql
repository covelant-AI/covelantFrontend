/*
  Warnings:

  - You are about to drop the `BallDetection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlayerDetection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BallDetection" DROP CONSTRAINT "BallDetection_matchId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerDetection" DROP CONSTRAINT "PlayerDetection_matchId_fkey";

-- DropTable
DROP TABLE "BallDetection";

-- DropTable
DROP TABLE "PlayerDetection";

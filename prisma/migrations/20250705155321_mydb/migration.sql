/*
  Warnings:

  - You are about to drop the column `eventTimeSeconds` on the `BallDetection` table. All the data in the column will be lost.
  - You are about to drop the column `frameIndex` on the `BallDetection` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `BallDetection` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `BallDetection` table. All the data in the column will be lost.
  - You are about to drop the column `eventTimeSeconds` on the `CourtKeypoint` table. All the data in the column will be lost.
  - You are about to drop the column `frameIndex` on the `CourtKeypoint` table. All the data in the column will be lost.
  - You are about to drop the column `keypointIndex` on the `CourtKeypoint` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `CourtKeypoint` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `CourtKeypoint` table. All the data in the column will be lost.
  - You are about to drop the column `eventTimeSeconds` on the `PlayerDetection` table. All the data in the column will be lost.
  - You are about to drop the column `frameIndex` on the `PlayerDetection` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `PlayerDetection` table. All the data in the column will be lost.
  - You are about to drop the column `x1` on the `PlayerDetection` table. All the data in the column will be lost.
  - You are about to drop the column `x2` on the `PlayerDetection` table. All the data in the column will be lost.
  - You are about to drop the column `y1` on the `PlayerDetection` table. All the data in the column will be lost.
  - You are about to drop the column `y2` on the `PlayerDetection` table. All the data in the column will be lost.
  - Added the required column `payload` to the `BallDetection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payload` to the `CourtKeypoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payload` to the `PlayerDetection` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BallDetection_matchId_frameIndex_key";

-- DropIndex
DROP INDEX "CourtKeypoint_matchId_frameIndex_keypointIndex_key";

-- DropIndex
DROP INDEX "PlayerDetection_matchId_frameIndex_playerId_key";

-- AlterTable
ALTER TABLE "BallDetection" DROP COLUMN "eventTimeSeconds",
DROP COLUMN "frameIndex",
DROP COLUMN "x",
DROP COLUMN "y",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payload" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "CourtKeypoint" DROP COLUMN "eventTimeSeconds",
DROP COLUMN "frameIndex",
DROP COLUMN "keypointIndex",
DROP COLUMN "x",
DROP COLUMN "y",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payload" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "PlayerDetection" DROP COLUMN "eventTimeSeconds",
DROP COLUMN "frameIndex",
DROP COLUMN "playerId",
DROP COLUMN "x1",
DROP COLUMN "x2",
DROP COLUMN "y1",
DROP COLUMN "y2",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payload" JSONB NOT NULL;

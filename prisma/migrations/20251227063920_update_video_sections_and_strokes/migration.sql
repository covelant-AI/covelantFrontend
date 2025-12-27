/*
  Warnings:

  - You are about to drop the column `strokes` on the `VideoSection` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `VideoSection` table. All the data in the column will be lost.
  - You are about to drop the `BallDetection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlayerDetection` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rallySize` to the `VideoSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validRally` to the `VideoSection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BallDetection" DROP CONSTRAINT "BallDetection_matchId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerDetection" DROP CONSTRAINT "PlayerDetection_matchId_fkey";

-- DropIndex
DROP INDEX "VideoSection_matchId_startIndex_endIndex_key";

-- AlterTable
ALTER TABLE "VideoSection" DROP COLUMN "strokes",
DROP COLUMN "summary",
ADD COLUMN     "playerWonPoint" TEXT,
ADD COLUMN     "rallySize" INTEGER NOT NULL,
ADD COLUMN     "validRally" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "BallDetection";

-- DropTable
DROP TABLE "PlayerDetection";

-- CreateTable
CREATE TABLE "Stroke" (
    "id" SERIAL NOT NULL,
    "videoSectionId" INTEGER NOT NULL,
    "strokeOrder" INTEGER NOT NULL,
    "startTime" DOUBLE PRECISION,
    "playerHit" TEXT NOT NULL,
    "topPlayerX" DOUBLE PRECISION,
    "topPlayerY" DOUBLE PRECISION,
    "bottomPlayerX" DOUBLE PRECISION,
    "bottomPlayerY" DOUBLE PRECISION,
    "ballSpeed" DOUBLE PRECISION,

    CONSTRAINT "Stroke_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bounce" (
    "id" SERIAL NOT NULL,
    "strokeId" INTEGER NOT NULL,
    "locationX" DOUBLE PRECISION,
    "locationY" DOUBLE PRECISION,
    "state" TEXT,
    "startTime" DOUBLE PRECISION,

    CONSTRAINT "Bounce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerSideSwitch" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "time" DOUBLE PRECISION NOT NULL,
    "topPlayerId" INTEGER NOT NULL,
    "bottomPlayerId" INTEGER NOT NULL,

    CONSTRAINT "PlayerSideSwitch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Stroke_videoSectionId_idx" ON "Stroke"("videoSectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Stroke_videoSectionId_strokeOrder_key" ON "Stroke"("videoSectionId", "strokeOrder");

-- CreateIndex
CREATE INDEX "Bounce_strokeId_idx" ON "Bounce"("strokeId");

-- CreateIndex
CREATE INDEX "PlayerSideSwitch_matchId_idx" ON "PlayerSideSwitch"("matchId");

-- CreateIndex
CREATE INDEX "PlayerSideSwitch_topPlayerId_idx" ON "PlayerSideSwitch"("topPlayerId");

-- CreateIndex
CREATE INDEX "PlayerSideSwitch_bottomPlayerId_idx" ON "PlayerSideSwitch"("bottomPlayerId");

-- AddForeignKey
ALTER TABLE "Stroke" ADD CONSTRAINT "Stroke_videoSectionId_fkey" FOREIGN KEY ("videoSectionId") REFERENCES "VideoSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bounce" ADD CONSTRAINT "Bounce_strokeId_fkey" FOREIGN KEY ("strokeId") REFERENCES "Stroke"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSideSwitch" ADD CONSTRAINT "PlayerSideSwitch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSideSwitch" ADD CONSTRAINT "PlayerSideSwitch_topPlayerId_fkey" FOREIGN KEY ("topPlayerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSideSwitch" ADD CONSTRAINT "PlayerSideSwitch_bottomPlayerId_fkey" FOREIGN KEY ("bottomPlayerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

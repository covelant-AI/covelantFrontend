/*
  Warnings:

  - You are about to drop the column `avgMatchDuration` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `matchLost` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `matchWon` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `setsLost` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `setsWon` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `totalMatches` on the `PlayerStat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerStat" DROP COLUMN "avgMatchDuration",
DROP COLUMN "matchLost",
DROP COLUMN "matchWon",
DROP COLUMN "setsLost",
DROP COLUMN "setsWon",
DROP COLUMN "totalMatches";

-- CreateTable
CREATE TABLE "OverallStats" (
    "id" SERIAL NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "setsWon" INTEGER NOT NULL DEFAULT 0,
    "setsLost" INTEGER NOT NULL DEFAULT 0,
    "totalMatches" INTEGER NOT NULL DEFAULT 0,
    "avgMatchDuration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "OverallStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OverallStats_playerId_key" ON "OverallStats"("playerId");

-- AddForeignKey
ALTER TABLE "OverallStats" ADD CONSTRAINT "OverallStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

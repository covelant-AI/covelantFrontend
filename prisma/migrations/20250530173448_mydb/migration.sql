/*
  Warnings:

  - A unique constraint covering the columns `[matchId,playerId,playerTwoId]` on the table `PlayerMatch` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PlayerMatch" ADD COLUMN     "playerTwoId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "PlayerMatch_matchId_playerId_playerTwoId_key" ON "PlayerMatch"("matchId", "playerId", "playerTwoId");

-- AddForeignKey
ALTER TABLE "PlayerMatch" ADD CONSTRAINT "PlayerMatch_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - The primary key for the `PlayerMatch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[matchId,playerId,opponentId]` on the table `PlayerMatch` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PlayerMatch" DROP CONSTRAINT "PlayerMatch_playerId_fkey";

-- AlterTable
ALTER TABLE "PlayerMatch" DROP CONSTRAINT "PlayerMatch_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "opponentId" INTEGER,
ALTER COLUMN "playerId" DROP NOT NULL,
ADD CONSTRAINT "PlayerMatch_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Opponent" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "Opponent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerMatch_matchId_playerId_opponentId_key" ON "PlayerMatch"("matchId", "playerId", "opponentId");

-- AddForeignKey
ALTER TABLE "PlayerMatch" ADD CONSTRAINT "PlayerMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMatch" ADD CONSTRAINT "PlayerMatch_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Opponent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

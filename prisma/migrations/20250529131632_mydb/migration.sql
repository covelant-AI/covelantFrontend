/*
  Warnings:

  - You are about to drop the column `coachId` on the `Player` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_coachId_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "coachId";

-- CreateTable
CREATE TABLE "_CoachPlayers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CoachPlayers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CoachPlayers_B_index" ON "_CoachPlayers"("B");

-- AddForeignKey
ALTER TABLE "_CoachPlayers" ADD CONSTRAINT "_CoachPlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachPlayers" ADD CONSTRAINT "_CoachPlayers_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

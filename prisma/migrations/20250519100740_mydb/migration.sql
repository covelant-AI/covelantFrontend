-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "videoLocation" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "videoType" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerMatch" (
    "playerId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "result" TEXT NOT NULL,

    CONSTRAINT "PlayerMatch_pkey" PRIMARY KEY ("playerId","matchId")
);

-- AddForeignKey
ALTER TABLE "PlayerMatch" ADD CONSTRAINT "PlayerMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMatch" ADD CONSTRAINT "PlayerMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

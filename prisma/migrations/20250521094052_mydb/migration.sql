-- CreateTable
CREATE TABLE "PlayerStat" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "PlayerStat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayerStat" ADD CONSTRAINT "PlayerStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

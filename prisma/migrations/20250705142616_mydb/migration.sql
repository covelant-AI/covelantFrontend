-- CreateTable
CREATE TABLE "PlayerDetection" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "frameIndex" INTEGER NOT NULL,
    "eventTimeSeconds" DOUBLE PRECISION NOT NULL,
    "x1" DOUBLE PRECISION NOT NULL,
    "y1" DOUBLE PRECISION NOT NULL,
    "x2" DOUBLE PRECISION NOT NULL,
    "y2" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PlayerDetection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourtKeypoint" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "keypointIndex" INTEGER NOT NULL,
    "frameIndex" INTEGER NOT NULL,
    "eventTimeSeconds" DOUBLE PRECISION NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CourtKeypoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlayerDetection_matchId_idx" ON "PlayerDetection"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerDetection_matchId_frameIndex_playerId_key" ON "PlayerDetection"("matchId", "frameIndex", "playerId");

-- CreateIndex
CREATE INDEX "CourtKeypoint_matchId_idx" ON "CourtKeypoint"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "CourtKeypoint_matchId_frameIndex_keypointIndex_key" ON "CourtKeypoint"("matchId", "frameIndex", "keypointIndex");

-- AddForeignKey
ALTER TABLE "PlayerDetection" ADD CONSTRAINT "PlayerDetection_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourtKeypoint" ADD CONSTRAINT "CourtKeypoint_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

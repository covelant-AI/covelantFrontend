-- CreateTable
CREATE TABLE "BallDetection" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "frameIndex" INTEGER NOT NULL,
    "eventTimeSeconds" DOUBLE PRECISION NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BallDetection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BallDetection_matchId_idx" ON "BallDetection"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "BallDetection_matchId_frameIndex_key" ON "BallDetection"("matchId", "frameIndex");

-- AddForeignKey
ALTER TABLE "BallDetection" ADD CONSTRAINT "BallDetection_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

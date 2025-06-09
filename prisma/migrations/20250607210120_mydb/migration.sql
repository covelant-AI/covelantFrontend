-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('BALL_SPEED', 'PLAYER_SPEED', 'LONGEST_RALLY', 'STRIKES_EFF');

-- CreateTable
CREATE TABLE "ScorePoint" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER,
    "opponentId" INTEGER,
    "setNumber" INTEGER NOT NULL,
    "eventTimeSeconds" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScorePoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchMetric" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER,
    "metricType" "MetricType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "eventTimeSeconds" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScorePoint_matchId_idx" ON "ScorePoint"("matchId");

-- CreateIndex
CREATE INDEX "ScorePoint_playerId_idx" ON "ScorePoint"("playerId");

-- CreateIndex
CREATE INDEX "ScorePoint_opponentId_idx" ON "ScorePoint"("opponentId");

-- CreateIndex
CREATE INDEX "MatchMetric_matchId_idx" ON "MatchMetric"("matchId");

-- CreateIndex
CREATE INDEX "MatchMetric_playerId_idx" ON "MatchMetric"("playerId");

-- CreateIndex
CREATE INDEX "MatchMetric_metricType_idx" ON "MatchMetric"("metricType");

-- AddForeignKey
ALTER TABLE "ScorePoint" ADD CONSTRAINT "ScorePoint_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScorePoint" ADD CONSTRAINT "ScorePoint_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScorePoint" ADD CONSTRAINT "ScorePoint_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Opponent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchMetric" ADD CONSTRAINT "MatchMetric_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchMetric" ADD CONSTRAINT "MatchMetric_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

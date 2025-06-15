-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('MATCH', 'TACTIC', 'FOULS', 'PHYSICAL', 'NOTE');

-- CreateEnum
CREATE TYPE "MatchEventType" AS ENUM ('FIRST_SERVE', 'SECOND_SERVE', 'BREAK_POINT', 'GAME_POINT', 'SET_POINT', 'TIEBREAK', 'START_OF_SET');

-- CreateEnum
CREATE TYPE "TacticEventType" AS ENUM ('SERVE_VOLLEY', 'BASELINE_RALLY', 'DROP_SHOT', 'NET_PLAY', 'CROSS_COURT_RALLY', 'DOWN_THE_LINE_SHOT', 'OPPONENT_PULLED_WIDE');

-- CreateEnum
CREATE TYPE "FoulsEventType" AS ENUM ('UNFORCED_ERROR', 'FORCED_ERROR', 'DOUBLE_FAULT', 'FOOT_FAULT', 'NET_TOUCH', 'RACKET_VIOLATION');

-- CreateEnum
CREATE TYPE "PhysicalEventType" AS ENUM ('FATIGUE_SIGN', 'SLOW_RECOVERY', 'INJURY_CONCERN', 'GOOD_MOVEMENT', 'POOR_FOOTWORK');

-- CreateEnum
CREATE TYPE "ConditionType" AS ENUM ('UNDER_PRESSURE', 'CONFIDENT', 'FOCUSED', 'LOST_FOCUS', 'MOMENTUM_SHIFT', 'CLUTCH_PLAY', 'FATIGUE_SIGNS');

-- CreateEnum
CREATE TYPE "NoteEventType" AS ENUM ('GENERAL', 'GREAT', 'POOR', 'IMPORTANT');

-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('BALL_SPEED', 'PLAYER_SPEED', 'LONGEST_RALLY', 'STRIKES_EFF', 'NOTE');

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "age" INTEGER,
    "dominantHand" TEXT DEFAULT 'Right Handed',
    "height" INTEGER DEFAULT 180,
    "winRate" DOUBLE PRECISION DEFAULT 1,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coach" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatar" TEXT,
    "email" TEXT NOT NULL,
    "team" TEXT,
    "age" INTEGER,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerStat" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "PlayerStat_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "videoUrl" TEXT,
    "imageUrl" TEXT,
    "type" TEXT,
    "result" TEXT,
    "fieldType" TEXT,
    "status" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "videoType" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatMatch" (
    "id" SERIAL NOT NULL,
    "condition" TEXT,

    CONSTRAINT "StatMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opponent" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "Opponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerMatch" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "playerId" INTEGER,
    "playerTwoId" INTEGER,
    "opponentId" INTEGER,

    CONSTRAINT "PlayerMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScorePoint" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER,
    "opponentId" INTEGER,
    "setNumber" INTEGER NOT NULL,
    "gamePoint" INTEGER NOT NULL DEFAULT 0,
    "matchPoint" INTEGER NOT NULL DEFAULT 0,
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

-- CreateTable
CREATE TABLE "MatchEvent" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "category" "EventCategory" NOT NULL,
    "comment" TEXT,
    "matchType" "MatchEventType",
    "tacticType" "TacticEventType",
    "foulType" "FoulsEventType",
    "physicalType" "PhysicalEventType",
    "noteType" "NoteEventType",
    "condition" "ConditionType",
    "eventTimeSeconds" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CoachPlayers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CoachPlayers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "PlayerStat_playerId_idx" ON "PlayerStat"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "OverallStats_playerId_key" ON "OverallStats"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerMatch_matchId_playerId_playerTwoId_key" ON "PlayerMatch"("matchId", "playerId", "playerTwoId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerMatch_matchId_playerId_opponentId_key" ON "PlayerMatch"("matchId", "playerId", "opponentId");

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

-- CreateIndex
CREATE INDEX "MatchEvent_matchId_category_idx" ON "MatchEvent"("matchId", "category");

-- CreateIndex
CREATE INDEX "_CoachPlayers_B_index" ON "_CoachPlayers"("B");

-- AddForeignKey
ALTER TABLE "PlayerStat" ADD CONSTRAINT "PlayerStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OverallStats" ADD CONSTRAINT "OverallStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMatch" ADD CONSTRAINT "PlayerMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMatch" ADD CONSTRAINT "PlayerMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMatch" ADD CONSTRAINT "PlayerMatch_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMatch" ADD CONSTRAINT "PlayerMatch_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Opponent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachPlayers" ADD CONSTRAINT "_CoachPlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachPlayers" ADD CONSTRAINT "_CoachPlayers_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

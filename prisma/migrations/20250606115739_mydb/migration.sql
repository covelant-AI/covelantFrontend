-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('MATCH', 'TACTIC', 'FOULS', 'PHYSICAL', 'COMMENT');

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

-- CreateTable
CREATE TABLE "StatMatch" (
    "id" SERIAL NOT NULL,
    "condition" TEXT,

    CONSTRAINT "StatMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchEvent" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "category" "EventCategory" NOT NULL,
    "matchType" "MatchEventType",
    "tacticType" "TacticEventType",
    "foulType" "FoulsEventType",
    "physicalType" "PhysicalEventType",
    "commentText" TEXT,
    "condition" "ConditionType",
    "eventTimeSeconds" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MatchEvent_matchId_category_idx" ON "MatchEvent"("matchId", "category");

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

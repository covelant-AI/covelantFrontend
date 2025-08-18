-- DropForeignKey
ALTER TABLE "BallDetection" DROP CONSTRAINT "BallDetection_matchId_fkey";

-- DropForeignKey
ALTER TABLE "CourtKeypoint" DROP CONSTRAINT "CourtKeypoint_matchId_fkey";

-- DropForeignKey
ALTER TABLE "MatchEvent" DROP CONSTRAINT "MatchEvent_matchId_fkey";

-- DropForeignKey
ALTER TABLE "MatchMetric" DROP CONSTRAINT "MatchMetric_matchId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerDetection" DROP CONSTRAINT "PlayerDetection_matchId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerMatch" DROP CONSTRAINT "PlayerMatch_matchId_fkey";

-- DropForeignKey
ALTER TABLE "ScorePoint" DROP CONSTRAINT "ScorePoint_matchId_fkey";

-- DropForeignKey
ALTER TABLE "VideoSection" DROP CONSTRAINT "VideoSection_matchId_fkey";

-- AddForeignKey
ALTER TABLE "PlayerDetection" ADD CONSTRAINT "PlayerDetection_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourtKeypoint" ADD CONSTRAINT "CourtKeypoint_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BallDetection" ADD CONSTRAINT "BallDetection_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoSection" ADD CONSTRAINT "VideoSection_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMatch" ADD CONSTRAINT "PlayerMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScorePoint" ADD CONSTRAINT "ScorePoint_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchMetric" ADD CONSTRAINT "MatchMetric_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

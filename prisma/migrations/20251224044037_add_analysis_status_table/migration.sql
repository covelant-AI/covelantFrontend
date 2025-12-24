-- CreateEnum
CREATE TYPE "AnalysisStatusType" AS ENUM ('IN_QUEUE', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "AnalysisStatus" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "server" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "status" "AnalysisStatusType" NOT NULL,
    "delayTime" INTEGER,
    "executionTime" INTEGER,

    CONSTRAINT "AnalysisStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisStatus_matchId_key" ON "AnalysisStatus"("matchId");

-- AddForeignKey
ALTER TABLE "AnalysisStatus" ADD CONSTRAINT "AnalysisStatus_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;


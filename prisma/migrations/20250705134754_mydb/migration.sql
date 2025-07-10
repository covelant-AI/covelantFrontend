-- CreateTable
CREATE TABLE "VideoSection" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "startIndex" INTEGER NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endIndex" INTEGER NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "VideoSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VideoSection_matchId_idx" ON "VideoSection"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoSection_matchId_startIndex_endIndex_key" ON "VideoSection"("matchId", "startIndex", "endIndex");

-- AddForeignKey
ALTER TABLE "VideoSection" ADD CONSTRAINT "VideoSection_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

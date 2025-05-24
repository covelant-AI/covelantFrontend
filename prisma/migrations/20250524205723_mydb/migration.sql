-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "location" TEXT,
ADD COLUMN     "result" TEXT,
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "winRate" INTEGER;

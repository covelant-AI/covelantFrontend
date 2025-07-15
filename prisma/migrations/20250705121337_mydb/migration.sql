-- AlterEnum
ALTER TYPE "TacticEventType" ADD VALUE 'RETURN';

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "fps" INTEGER,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "totalFrames" INTEGER,
ADD COLUMN     "width" INTEGER;

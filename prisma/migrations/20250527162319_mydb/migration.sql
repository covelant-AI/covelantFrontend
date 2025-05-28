-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "Tier" TEXT DEFAULT 'Professional',
ADD COLUMN     "age" TEXT,
ADD COLUMN     "dominantHand" TEXT DEFAULT 'Right Handed',
ADD COLUMN     "height" TEXT;

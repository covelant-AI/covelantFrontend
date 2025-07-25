-- AlterTable
ALTER TABLE "Coach" ADD COLUMN     "credits" INTEGER DEFAULT 0,
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "priceId" TEXT DEFAULT 'Free';

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "credits" INTEGER DEFAULT 0,
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "priceId" TEXT DEFAULT 'Free';

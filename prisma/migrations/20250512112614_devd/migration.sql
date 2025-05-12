-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_coachId_fkey";

-- AlterTable
ALTER TABLE "Coache" ALTER COLUMN "team" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "coachId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coache"("id") ON DELETE SET NULL ON UPDATE CASCADE;

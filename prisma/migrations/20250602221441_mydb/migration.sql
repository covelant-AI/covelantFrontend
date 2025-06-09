/*
  Warnings:

  - The `age` column on the `Coach` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Coach" DROP COLUMN "age",
ADD COLUMN     "age" INTEGER;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "status" TEXT;

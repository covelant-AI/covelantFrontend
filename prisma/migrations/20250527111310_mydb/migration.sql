/*
  Warnings:

  - You are about to drop the column `location` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "location",
ADD COLUMN     "fieldType" TEXT;

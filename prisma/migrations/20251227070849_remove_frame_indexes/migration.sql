/*
  Warnings:

  - You are about to drop the column `endIndex` on the `VideoSection` table. All the data in the column will be lost.
  - You are about to drop the column `startIndex` on the `VideoSection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VideoSection" DROP COLUMN "endIndex",
DROP COLUMN "startIndex";

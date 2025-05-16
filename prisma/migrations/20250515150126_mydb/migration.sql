/*
  Warnings:

  - Added the required column `firstName` to the `Coach` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Coach` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coach" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

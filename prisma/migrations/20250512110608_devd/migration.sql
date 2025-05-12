/*
  Warnings:

  - Added the required column `email` to the `Coache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coache" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "email" TEXT NOT NULL;

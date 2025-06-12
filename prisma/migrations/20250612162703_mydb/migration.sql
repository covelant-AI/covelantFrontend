/*
  Warnings:

  - The values [COMMENT] on the enum `EventCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `comment` on the `MatchEvent` table. All the data in the column will be lost.
  - You are about to drop the column `commentText` on the `MatchEvent` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NoteEventType" AS ENUM ('GENERAL', 'GREAT', 'POOR', 'IMPORTANT');

-- AlterEnum
BEGIN;
CREATE TYPE "EventCategory_new" AS ENUM ('MATCH', 'TACTIC', 'FOULS', 'PHYSICAL', 'NOTE');
ALTER TABLE "MatchEvent" ALTER COLUMN "category" TYPE "EventCategory_new" USING ("category"::text::"EventCategory_new");
ALTER TYPE "EventCategory" RENAME TO "EventCategory_old";
ALTER TYPE "EventCategory_new" RENAME TO "EventCategory";
DROP TYPE "EventCategory_old";
COMMIT;

-- AlterTable
ALTER TABLE "MatchEvent" DROP COLUMN "comment",
DROP COLUMN "commentText",
ADD COLUMN     "noteType" "NoteEventType";

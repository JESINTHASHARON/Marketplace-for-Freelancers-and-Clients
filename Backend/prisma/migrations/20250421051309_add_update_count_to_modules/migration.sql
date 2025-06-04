/*
  Warnings:

  - Made the column `deadlineDays` on table `Module` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectURL` on table `Module` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "updateCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "deadlineDays" SET NOT NULL,
ALTER COLUMN "projectURL" SET NOT NULL,
ALTER COLUMN "projectURL" SET DEFAULT '';

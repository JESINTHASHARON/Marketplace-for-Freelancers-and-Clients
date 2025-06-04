-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "deadlineDays" INTEGER,
ADD COLUMN     "projectURL" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'WAITING';

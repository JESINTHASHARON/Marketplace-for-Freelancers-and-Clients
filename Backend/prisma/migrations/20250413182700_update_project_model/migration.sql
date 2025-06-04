-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "images" SET DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "Bid" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "projectId" INTEGER NOT NULL,
    "freelancerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

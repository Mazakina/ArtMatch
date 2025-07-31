-- AlterTable
ALTER TABLE "albums" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image" TEXT,
ALTER COLUMN "createdAt" SET DEFAULT now(),
ALTER COLUMN "updatedAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "albums" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT now(),
ALTER COLUMN "updatedAt" SET DEFAULT now(),
ALTER COLUMN "username" DROP NOT NULL;

-- AlterTable
ALTER TABLE "albums" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT now(),
ALTER COLUMN "updatedAt" SET DEFAULT now();

-- CreateTable
CREATE TABLE "user_favorites" (
    "userId" UUID NOT NULL,
    "favoritedId" UUID NOT NULL,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("userId","favoritedId")
);

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_favoritedId_fkey" FOREIGN KEY ("favoritedId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

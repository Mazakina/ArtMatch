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
CREATE TABLE "_AlbumPosts" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AlbumPosts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AlbumPosts_B_index" ON "_AlbumPosts"("B");

-- AddForeignKey
ALTER TABLE "_AlbumPosts" ADD CONSTRAINT "_AlbumPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumPosts" ADD CONSTRAINT "_AlbumPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

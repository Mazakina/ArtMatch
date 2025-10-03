import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../services/db/prisma";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function manageAlbum(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const albumName = req.body.albumName;
  const action = req.body.action;

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { albums: true },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    switch (action) {
      case "delete":
        const albumId = req.body.albumId;

        await prisma.album.delete({
          where: {
            id: albumId,
            userId: user.id,
          },
        });

        return res.status(200).json({ message: "Album deleted successfully" });

      case "create":
        const newAlbum = await prisma.album.create({
          data: {
            userId: user.id,
            title: albumName || "Meu Álbum",
          },
        });

        return res.status(200).json({
          id: newAlbum.id,
          title: newAlbum.title,
          createdAt: newAlbum.createdAt,
        });

      case "update":
        const albumIdToUpdate = req.body.albumId;

        const updatedAlbum = await prisma.album.update({
          where: {
            id: albumIdToUpdate,
            userId: user.id,
          },
          data: {
            title: albumName,
          },
        });

        return res.status(200).json({
          id: updatedAlbum.id,
          title: updatedAlbum.title,
          createdAt: updatedAlbum.createdAt,
        });

      case "get":
        const albums = await prisma.album.findMany({
          where: { userId: user.id },
          include: {
            posts: {
              select: {
                id: true,
                title: true,
                url: true,
                description: true,
                createdAt: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({ albums });

      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("Error managing album:", error);
    return res.status(500).json({ error: "Failed to manage album" });
  }
}

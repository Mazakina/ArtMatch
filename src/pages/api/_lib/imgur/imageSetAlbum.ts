import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../services/db/prisma";

export default async function imgurSetAlbum(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    const reqData = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.user.email,
      },
      include: {
        albums: {
          include: {
            posts: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).end("User not found");
    }
    try {
      const updatedAlbum = await prisma.album.update({
        where: {
          id: reqData.albumRef,
        },
        data: {
          posts: {
            connect: { id: reqData.id },
          },
        },
      });
      res.status(200).json(updatedAlbum);

      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(401).end("unauthorized");
    }
  } else {
    res.setHeader("allow", "PATCH");
    return res.status(405).end("Method not allowed");
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";
import prisma from "../../../../services/db/prisma";

export default async function imgurGetAllFeed(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    let data = await prisma.posts.findMany({
      where: {
        posted: true,
      },
      include: {
        author: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
      take: 30,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(data);
  } else {
    return res.status(405).end("Allow GET");
  }
}

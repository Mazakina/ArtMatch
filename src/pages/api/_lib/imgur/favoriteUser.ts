import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../services/db/prisma";

interface userProps {
  ref: string;
  ts: number | string;
  data: {
    user: string;
    banner: string;
    avatar: string;
  };
}

export default async function favoriteUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  async function getUser() {
    const user = prisma.user.findUnique({
      where: {
        email: req.body.data.email,
      },
      include: {
        favoritedUsers: true,
      },
    });

    return user;
  }
  async function getPostOwner() {
    const postOwner = prisma.user.findUnique({
      where: {
        username: req.body.postOwnerName.replace(/_/g, " "),
      },
    });

    return postOwner;
  }

  if (req.method === "POST") {
    const user = await getUser();
    const postOwner = await getPostOwner();
    const response = await prisma.userFavorite.upsert({
      where: {
        userId_favoritedId: {
          userId: user.id,
          favoritedId: postOwner.id,
        },
      },
      create: {
        userId: user.id,
        favoritedId: postOwner.id,
      },
      update: {},
    });
    return res.status(200).json(response);
  }

  if (req.method === "PATCH") {
    return res.status(405).end("Method Not Allowed");
  }

  if (req.method === "DELETE") {
    const user = await getUser();
    const postOwner = await getPostOwner();
    if (!user || !postOwner) {
      return res.status(404).end("User or Post Owner not found");
    }

    try {
      const deletedFavorite = await prisma.userFavorite.delete({
        where: {
          userId_favoritedId: {
            userId: user.id,
            favoritedId: postOwner.id,
          },
        },
      });

      return res.status(200).json(deletedFavorite);
    } catch (error) {
      return res.status(404).end("Favorite not found");
    }
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../services/db/prisma";

interface UserProps {
  ref: string;
  ts: number | string;
  data: {
    user: string;
    banner: string;
    avatar: string;
  };
}
interface FavoritedUsers {
  ref: string;
  data: {
    userId: string;
    favoritedUsers: {
      id: number;
    }[];
  };
}

interface FavoritedPosts {
  ref: string;
  data: {
    userId: string;
    favoritedPosts: number[];
  };
}
export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.data.user.email,
        },
        include: {
          favoritedUsers: true,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end("Method Not Allowed");
  }
}

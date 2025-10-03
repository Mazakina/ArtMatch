import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../services/db/prisma";

interface userProps {
  ref?: string;
  ts?: number | string;
  data?: {
    user: string;
    banner: string;
    avatar: string;
  };
}
interface ResponseData {
  id: string;
  title: string;
  description: string;
  timeStamp: string;
  vote: number | null;
  nsfw: boolean;
  url: string;
  deleteHash: string;
  posted: boolean;
  album: string;
  tags: string[];
  midia: string;
}

export default async function imgurGetAllFromUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const reqData = req.headers;

    let user;
    try {
      if (reqData.by_email == "true") {
        user = await prisma.user.findUnique({
          where: {
            email: reqData.user as string,
          },
        });
      } else {
        user = await prisma.user.findUnique({
          where: {
            username: (reqData.user as string).replace(/_/g, " ").toLowerCase(),
          },
        });
      }
    } catch {
      res.status(400).json({ error: "User not found!" });
    }
    try {
      const responseData = await prisma.posts.findMany({
        where: {
          authorId: user.id,
        },
        orderBy: {
          timeStamp: "desc",
        },
      });
      if (reqData.get_albums) {
        const allAlbums = await prisma.album.findMany({
          where: {
            userId: user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        // );
        const responseToArray = Object.values(responseData);
        const postsArray = responseToArray.map((post) => {
          return {
            ...post,
            ...user.data,
          };
        });
        return res.status(200).json({ posts: postsArray, albums: allAlbums });
      } else {
        const responseToArray = Object.values(responseData);
        const postsArray = responseToArray.map((post) => {
          return {
            ...post,
            ...user.data,
          };
        });
        return res.status(200).json({ posts: postsArray });
      }
    } catch (e) {
      res.status(400).end("");
    }
  } else {
    res.setHeader("allow", "GET");
    res.status(405).end("Method not allowed");
  }
}

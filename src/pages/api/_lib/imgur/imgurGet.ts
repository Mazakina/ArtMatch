import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";
import prisma from "../../../../services/db/prisma";

interface mapPostProps {
  data: {
    userId: string;
    posts: any;
  };
}

class ResponseDataProps {
  id: string;
  title: string;
  description: string;
  timeStamp: number;
  vote: number | null;
  nsfw: boolean;
  URL: string;
  deleteHash: string;
  posted: boolean;
  album: string;
  tags: Array<string>;
  midia: string;
  likes: string[];
  user:
    | {
        name: string;
        avatar: string;
        banner: string;
        userId?: string;
        ref: string;
      }
    | string;
}

export default async function imgurGet(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    let otherPosts;
    let userId;
    let post;
    let responseData = new ResponseDataProps();
    // Object.assign(responseData, {
    //   id: "",
    //   title: "",
    //   description: "",
    //   nsfw: false,
    //   URL: "",
    //   deleteHash: "",
    //   posted: true,
    //   album: "",
    //   timeStamp: 0,
    //   tags: [],
    //   vote: null,
    //   midia: "",
    //   user: "",
    //   likes: [],
    // });

    const hash = req.headers.id as string;
    try {
      otherPosts = await prisma.posts.findMany({
        where: {
          userId: userId,
          posted: true,
          NOT: {
            hash: hash,
          },
        },
        select: {
          title: true,
          url: true,
          hash: true,
        },
        pagination: {
          take: 6,
        },
      });
      post = await prisma.posts.findUnique({
        where: {
          hash: hash,
        },
        include: {
          user: {
            select: {
              id: true,
              avatarUrl: true,
              bannerUrl: true,
              username: true,
            },
          },
        },
      });

      if (!post) {
        return res.status(400).end("Post not Found");
      }

      Object.assign(responseData, {
        id: post.id,
        title: post.title,
        description: post.description,
        nsfw: post.nsfw,
        URL: post.url,
        deleteHash: post.deleteHash,
        posted: post.posted,
        album: post.album,
        likes: post.likes,
      });
      var config = {
        method: "get",
        url: `https://api.imgur.com/3/image/${hash}`,
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
      };
      Api(config)
        .then(function (response) {
          const data = response.data.data;
          responseData.timeStamp = data.datetime;

          return res.status(202).json({ ...responseData, otherPosts });
        })
        .catch(function (error) {
          error;
          return res.status(500).end("Server error");
        });
    } catch (e) {
      return res.status(400).end("User not Found");
    }
  } else {
    res.setHeader("allow", "GET");
    return res.status(405).end("Method not allowed");
  }
}

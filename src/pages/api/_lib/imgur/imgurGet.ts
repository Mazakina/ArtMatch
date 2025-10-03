import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";
import prisma from "../../../../services/db/prisma";

interface mapPostProps {
  data: {
    authorId: string;
    posts: any;
  };
}

class ResponseDataProps {
  id: string;
  title: string;
  description: string;
  timeStamp: string;
  vote: number | null;
  nsfw: boolean;
  URL: string;
  deleteHash: string;
  posted: boolean;
  album: string;
  tags: Array<string>;
  midia: string;
  likes: number;
  user:
    | {
        name: string;
        avatar: string;
        banner: string;
        authorId?: string;
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
    let authorId;
    let post;
    let responseData = new ResponseDataProps();

    const postId = req.headers.id as string;
    try {
      // First get the post to find the author
      post = await prisma.posts.findUnique({
        where: {
          id: postId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              username: true,
            },
          },
        },
      });

      if (!post) {
        return res.status(400).end("Post not Found");
      }

      // Get other posts from the same author
      otherPosts = await prisma.posts.findMany({
        where: {
          authorId: post.authorId,
          posted: true,
          NOT: {
            id: postId,
          },
        },
        select: {
          id: true,
          title: true,
          url: true,
        },
        take: 6,
      });

      Object.assign(responseData, {
        id: post.id,
        title: post.title,
        description: post.description,
        URL: post.url,
        deleteHash: post.deleteHash,
        posted: post.posted,
        likes: post.likes,
        tags: post.tags,
        midia: post.midia,
        user: {
          name: post.author.name,
          username: post.author.username,
          avatarUrl: post.author.avatarUrl,
        }
      });

      var config = {
        method: "get",
        url: `https://api.imgur.com/3/image/${postId}`,
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
      };
      
      Api(config)
        .then(function (response) {
          const data = response.data.data;
          responseData.timeStamp = data.datetime.toString();

          return res.status(200).json({ ...responseData, otherPosts });
        })
        .catch(function (error) {
          console.error('Imgur API error:', error);
          return res.status(500).end("Server error");
        });
    } catch (e) {
      console.error('Database error:', e);
      return res.status(400).end("Post not Found");
    }
  } else {
    res.setHeader("allow", "GET");
    return res.status(405).end("Method not allowed");
  }
}

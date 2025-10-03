import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";
import prisma from "../../../../services/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { create } from "domain";
// import { getSession } from "next-auth/react";
export default async function imgurPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const session = await getServerSession(req, res, authOptions);
  // const session = await getSession({ req });
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const reqData = req.body;
  const image = reqData.image;
  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      posts: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  // Upload main image to Imgur
  const mainImageConfig = {
    method: "post",
    url: "https://api.imgur.com/3/image",
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      Accept: "application/json",
    },
    data: {
      image: image.split(",")[1],
      type: "base64",
    },
    maxContentLength: 100000000,
    maxBodyLength: 100000000,
  };

  try {
    const response = await Api(mainImageConfig);

    // Upload cropped image to Imgur
    const croppedImageConfig = {
      ...mainImageConfig,
      data: {
        image: reqData.croppedImage.split(",")[1],
        type: "base64",
      },
    };

    const cropResponse = await Api(croppedImageConfig);
    const resData = response.data.data;
    console.log("cropped", cropResponse.data.data);
    // Create post in database
    
    const newPost = await prisma.posts.create({
      data: {
        croppedDeleteHash: cropResponse.data.data.deletehash,
        cropped: cropResponse.data.data.link,
        id: resData.id,
        authorId: user.id,
        title: reqData.title,
        description: reqData.description,
        deleteHash: resData.deletehash,
        url: resData.link,
        posted: reqData.posted,
        tags: reqData.tags || [],
        midia: reqData.midia,
        timeStamp: resData.datetime.toString(),
        likes: 0,
      },
    });

    // Ensure user has a collection, create if not exists
    let collection = await prisma.collection.findFirst({
      where: { userId: user.id },
    });

    if (!collection) {
      collection = await prisma.collection.create({
        data: {
          userId: user.id,
          title: "Minha Coleção",
          visible: true,
        },
      });
    }

    return res.status(201).json({
      id: newPost.id,
      title: newPost.title,
      description: newPost.description,
      deleteHash: newPost.deleteHash,
      url: newPost.url,
      posted: newPost.posted,
      tags: newPost.tags,
      midia: newPost.midia,
      cropped: cropResponse.data.data.link,
      croppedDeleteHash: cropResponse.data.data.deletehash,
      likes: newPost.likes,
      createdAt: resData.datetime,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ error: "Failed to create post" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};

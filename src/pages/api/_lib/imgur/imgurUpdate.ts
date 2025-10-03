import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";  
import FormData from 'form-data';
import prisma from "../../../../services/db/prisma";
import { getSession } from "next-auth/react";

export default async function imgurUpdate(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    res.setHeader('allow', 'PUT');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const reqData = req.body;
  const deleteHash = reqData.deleteHash;
  const postId = reqData.id;

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Verify the post belongs to the user
  const existingPost = await prisma.posts.findFirst({
    where: {
      id: postId,
      authorId: user.id
    }
  });

  if (!existingPost) {
    return res.status(404).json({ error: 'Post not found or unauthorized' });
  }

  try {
    // Prepare form data for Imgur API
    const formData = new FormData();
    
    if (reqData.title) {
      formData.append('title', reqData.title);
    }
    if (reqData.description) {
      formData.append('description', reqData.description);
    }

    // Update image on Imgur
    const config = {
      method: 'post',
      url: `https://api.imgur.com/3/image/${deleteHash}`,
      headers: { 
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, 
        'content-type': 'multipart/form-data'
      },
      data: formData,
    };

    const imgurResponse = await Api(config);

    // Update post in database
    const updatedPost = await prisma.posts.update({
      where: { id: postId },
      data: {
        title: reqData.title || existingPost.title,
        description: reqData.description || existingPost.description,
        url: reqData.image || existingPost.url,
        posted: reqData.posted !== undefined ? reqData.posted : existingPost.posted,
        tags: reqData.tags ? reqData.tags : existingPost.tags,
        midia: reqData.midia || existingPost.midia,
      }
    });

    return res.status(200).json(updatedPost);

  } catch (error) {
    console.error('Error updating post:', error);
    return res.status(500).json({ error: 'Failed to update post' });
  }
}
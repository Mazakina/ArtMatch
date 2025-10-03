import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../services/db/prisma";
import { getSession } from "next-auth/react";

export default async function favoritePost(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const postId = req.body.id;

  if (req.method === 'POST') {
    // Get user's favorite posts
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          likedPosts: true
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ favoritePosts: user.likedPosts });
    } catch (error) {
      return res.status(400).json({ error: 'Posts not found' });
    }
  }

  if (req.method === 'PATCH') {
    // Add post to favorites
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if post exists
      const post = await prisma.posts.findUnique({
        where: { id: postId }
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Add post to user's liked posts (many-to-many relationship)
      await prisma.user.update({
        where: { id: user.id },
        data: {
          likedPosts: {
            connect: { id: postId }
          }
        }
      });

      return res.status(201).json({ message: 'Post added to favorites' });
    } catch (error) {
      return res.status(400).json({ error: 'Failed to add to favorites' });
    }
  }

  if (req.method === 'DELETE') {
    // Remove post from favorites
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove post from user's liked posts
      await prisma.user.update({
        where: { id: user.id },
        data: {
          likedPosts: {
            disconnect: { id: postId }
          }
        }
      });

      return res.status(202).json({ message: 'Post removed from favorites' });
    } catch (error) {
      return res.status(404).json({ error: 'Failed to remove from favorites' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
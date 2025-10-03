import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../services/db/prisma";
import { getSession } from "next-auth/react";

export default async function likePost(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const postId = req.body.id;

  if (req.method === 'GET') {
    // Get user information
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          likedPosts: true,
          posts: true
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ user });
    } catch (error) {
      return res.status(400).json({ error: 'Failed to get user data' });
    }
  }

  if (req.method === 'POST') {
    // Get post owner information
    try {
      const post = await prisma.posts.findUnique({
        where: { id: postId },
        include: {
          author: {
            include: {
              profile: true
            }
          }
        }
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      return res.status(200).json({ postOwner: post.author });
    } catch (error) {
      return res.status(400).json({ error: 'Failed to get post owner' });
    }
  }

  if (req.method === 'PATCH') {
    // Add like to post
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

      // Add like (connect user to post's likedBy relationship)
      await prisma.posts.update({
        where: { id: postId },
        data: {
          likedBy: {
            connect: { id: user.id }
          },
          likes: {
            increment: 1
          }
        }
      });

      return res.status(201).json({ message: 'Post liked successfully' });
    } catch (error) {
      return res.status(400).json({ error: 'Failed to like post' });
    }
  }

  if (req.method === 'DELETE') {
    // Remove like from post
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove like (disconnect user from post's likedBy relationship)
      await prisma.posts.update({
        where: { id: postId },
        data: {
          likedBy: {
            disconnect: { id: user.id }
          },
          likes: {
            decrement: 1
          }
        }
      });

      return res.status(202).json({ message: 'Like removed successfully' });
    } catch (error) {
      return res.status(404).json({ error: 'Failed to remove like' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

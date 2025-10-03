import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../services/db/prisma";

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
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).end("Method Not Allowed");
  }
}

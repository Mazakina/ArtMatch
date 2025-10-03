import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../services/db/prisma";

interface userProps {
  ref: string;
  ts: number | string;
  data: {
    email: string;
  };
}
interface userSettingsProps {
  data: object;
  ref: object;
  ts: number;
}
export default async function getUserProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqData = JSON.parse(req.body);
  const userName = reqData.user.slug.replace(/_/g, " ");
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        username: userName,
      },
      include: {
        profile: true,
      },
    });
  } catch (e) {
    return res.status(404).json({ ok: false });
  }

  const { data } = user;

  return res.status(200).json({ data });
}

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
export default async function getUserSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getSession({ req });
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        email: token.user?.email,
      },
      include: {
        settings: true,
      },
    });

    const { data } = user.settings;
    return res.status(200).json({
      data,
    });
  } catch (e) {
    return res.status(404);
  }
}

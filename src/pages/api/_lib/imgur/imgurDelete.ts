import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";
import FormData from "form-data";
import prisma from "../../../../services/db/prisma";

export default async function imgurDelete(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const formData = new FormData();
    const reqData = req.body;
    const deleteHash = reqData.deleteHash;
    const userEmail = reqData.user.email;

    // ---------------------------
    var config = {
      method: "delete",
      url: `https://api.imgur.com/3/image/${deleteHash}`,
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        Accept: "application/json",
      },
      data: formData,
    };
    Api(config)
      .then(async (response) => {
        res.status(200);
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: userEmail,
            },
          });

          if (!user) {
            return res.status(401).end("unauthorized");
          }
          if (user.email !== reqData.user.email) {
            return res.status(401).end("unauthorized");
          }
          await prisma.posts.deleteMany({
            where: {
              deleteHash: deleteHash,
            },
          });

          return res.status(200).json({ ok: true });
        } catch (e) {
          return res.status(401).end("unauthorized");
        }
      })
      .catch(function (error) {
        return res.status(401).end("upload unauthorized");
      });
  } else {
    res.setHeader("allow", "POST");
    return res.status(405).end("Method not allowed");
  }
}

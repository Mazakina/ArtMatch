import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../services/db/prisma";
import { getSession } from "next-auth/react";
import { Api } from "../../../../services/api";
import FormData from "form-data";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function saveUserSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  console.log(session);
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const reqData = req.body;
  const section = req.body.section;
  let newData;
  let avatar;
  let banner;
  let bannerDeleteHash;
  let avatarDeleteHash;

  // Get current user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      profile: true,
      socialLinks: true,
      settings: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  switch (section) {
    case "profile":
      // Check if username is already taken
      if (reqData.usuario && reqData.usuario !== user.name) {
        const existingUser = await prisma.user.findFirst({
          where: {
            name: reqData.usuario,
            NOT: { id: user.id },
          },
        });

        if (existingUser) {
          return res.status(405).json({ message: "usuario já existente" });
        }
      }

      try {
        // Handle banner upload
        if (!!req.body.banner) {
          if (user.profile?.bannerDeleteHash) {
            deleteImgur(user.profile.bannerDeleteHash);
          }
          const newBannerData = await postImgur(req.body.banner);
          banner = newBannerData.data.data.link;
          bannerDeleteHash = newBannerData.data.data.deletehash;
        }

        // Handle avatar upload
        if (!!req.body.avatar) {
          if (user.profile?.avatarDeleteHash) {
            deleteImgur(user.profile.avatarDeleteHash);
          }
          const newAvatarData = await postImgur(req.body.avatar);
          avatar = newAvatarData.data.data.link;
          avatarDeleteHash = newAvatarData.data.data.deletehash;
        }

        // Update user name if provided
        if (reqData.usuario) {
          await prisma.user.update({
            where: { id: user.id },
            data: { name: reqData.usuario },
          });
        }
        // Update or create user profile
        try {
          console.log("updating");
          const response = await prisma.userProfile.upsert({
            where: { userId: user.id },
            update: {
              bio: reqData.biografia,
              skills: reqData.habilidades,
              city: reqData.cidade,
              address: reqData.endereco,
              addressNumber: reqData.numero,
              ...(avatar && { avatar, avatarDeleteHash }),
              ...(banner && { banner, bannerDeleteHash }),
            },
            create: {
              userId: user.id,
              bio: reqData.biografia,
              skills: reqData.habilidades,
              city: reqData.cidade,
              address: reqData.endereco,
              addressNumber: reqData.numero,
              avatar: avatar || user.image,
              banner: banner,
              avatarDeleteHash,
              bannerDeleteHash,
            },
          });
          console.log(response);
        } catch (error) {
          console.log(error);
          return res.status(400).json({ error: "Failed to update profile" });
        }

        newData = {
          usuario: reqData.usuario,
          biografia: reqData.biografia,
          habilidades: reqData.habilidades,
          cidade: reqData.cidade,
          endereco: reqData.endereco,
          numero: reqData.numero,
          avatar: avatar || user.profile?.avatar,
          banner: banner || user.profile?.banner,
          bannerDeleteHash: bannerDeleteHash || user.profile?.bannerDeleteHash,
          avatarDeleteHash: avatarDeleteHash || user.profile?.avatarDeleteHash,
        };
        return res.status(200).json({ ok: true });
      } catch (error) {
        return res.status(400).json({ error: "Failed to update profile" });
      }
      break;

    case "social":
      try {
        // Update or create social links
        await prisma.userSocialLinks.upsert({
          where: { userId: user.id },
          update: {
            instagram: reqData.instagram,
            artstation: reqData.artstation,
            behance: reqData.behance,
            phone: reqData.telefone,
          },
          create: {
            userId: user.id,
            instagram: reqData.instagram,
            artstation: reqData.artstation,
            behance: reqData.behance,
            phone: reqData.telefone,
          },
        });

        newData = {
          instagram: reqData.instagram,
          artstation: reqData.artstation,
          behance: reqData.behance,
          telefone: reqData.telefone,
        };
        return res.status(200).json({ ok: true });
      } catch (error) {
        return res.status(400).json({ error: "Failed to update social links" });
      }
      break;

    case "seguranca":
      try {
        // Update user settings
        await prisma.userSettings.upsert({
          where: { userId: user.id },
          update: {
            contactEmail: reqData.email?.email || session.user.email,
            nsfwAllow: reqData.nsfwAllow,
            allowToBeFound: reqData.allowToBeFound,
          },
          create: {
            userId: user.id,
            contactEmail: reqData.email?.email || session.user.email,
            nsfwAllow: reqData.nsfwAllow,
            allowToBeFound: reqData.allowToBeFound,
          },
        });

        // Update collection visibility
        await prisma.collection.updateMany({
          where: { userId: user.id },
          data: { visible: reqData.allowToBeFound },
        });

        newData = {
          email: {
            email: session.user.email,
          },
          nsfwAllow: reqData.nsfwAllow,
          allowToBeFound: reqData.allowToBeFound,
        };
        return res.status(200).json({ ok: true });
      } catch (error) {
        return res
          .status(400)
          .json({ error: "Failed to update security settings" });
      }
      break;

    default:
      return res.status(400).json({ error: "Invalid section" });
  }

  return res.status(200).json({ ok: true, data: newData });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};

export async function deleteImgur(deleteHash: string) {
  if (!!deleteHash) {
    const formData = new FormData();
    var config = {
      method: "delete",
      url: `https://api.imgur.com/3/image/${deleteHash}`,
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        Accept: "application/json",
      },
      data: formData,
    };
    Api(config);
  }
}

export async function postImgur(image: string) {
  const formData = new FormData();
  const imageData = image.substring(image.indexOf(",") + 1);
  formData.append("image", imageData);
  var config = {
    method: "post",
    url: "https://api.imgur.com/3/image",
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      Accept: "application/json",
    },
    data: formData,
    maxContentLength: 100000000,
    maxBodyLength: 100000000,
  };
  let data = await Api(config);
  return data;
}

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../services/db/prisma";

export default async function getUserSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        profile: true,
        socialLinks: true,
        settings: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Transform the data to match the expected structure
    const transformedData = {
      data: {
        profile: {
          usuario: user.name || "",
          biografia: user.profile?.bio || "",
          habilidades: user.profile?.skills || [],
          cidade: user.profile?.city || "",
          endereco: user.profile?.address || "",
          avatar: user.profile?.avatar || user.image || "",
          avatarDeleteHash: user.profile?.avatarDeleteHash || "",
          banner: user.profile?.banner || "",
          bannerDeleteHash: user.profile?.bannerDeleteHash || "",
        },
        social: {
          instagram: user.socialLinks?.instagram || "",
          artstation: user.socialLinks?.artstation || "",
          behance: user.socialLinks?.behance || "",
          telefone: user.socialLinks?.phone || "",
        },
        seguranca: {
          email: {
            email: user.email,
          },
          nsfwAllow: user.settings?.nsfwAllow || false,
          allowToBeFound: user.settings?.allowToBeFound || true,
        },
        bloqueados: [],
      },
    };

    return res.status(200).json(transformedData);
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
